import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { User } from '@/types/user';
import { Project, InvestmentLevel, TimeIntensity, ProjectCategory } from '@/types/project';
import { currentUser, mockUsers } from '@/data/users';
import { mockProjects } from '@/data/projects';

const STORAGE_KEYS = {
  USER: 'partner_app_user',
  PROJECTS: 'partner_app_projects',
  GLOBAL_FILTER: 'partner_app_global_filter',
  MEET_INVITATIONS: 'partner_app_meet_invitations',
};

const safeParse = <T,>(data: string | null, fallback: T): T => {
  if (!data) return fallback;
  try {
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
};

const safeSetStorage = (key: string, value: any) => {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[Storage] 写入失败:', key, e);
  }
};

const safeGetStorage = <T,>(key: string, fallback: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    return safeParse<T>(data, fallback);
  } catch (e) {
    console.warn('[Storage] 读取失败:', key, e);
    return fallback;
  }
};

export interface GlobalFilterOptions {
  categories: string[];
  investmentMin: number;
  investmentMax: number;
  investmentLevels: InvestmentLevel[];
  timeIntensities: TimeIntensity[];
  roles: string[];
  distanceMax: number;
  sortBy: string;
}

export interface MeetInvitation {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  date: string;
  time: string;
  location: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface AppContextType {
  user: User;
  setUser: (user: User) => void;
  unreadMessageCount: number;
  setUnreadMessageCount: (count: number) => void;
  allUsers: User[];
  getUserById: (id: string) => User | undefined;
  projects: Project[];
  addProject: (project: Project) => void;
  getMyPublishedProjects: () => Project[];
  getMyJoinedProjects: () => Project[];
  globalFilter: GlobalFilterOptions | null;
  setGlobalFilter: (filter: GlobalFilterOptions | null) => void;
  meetInvitations: MeetInvitation[];
  sendMeetInvitation: (invitation: Omit<MeetInvitation, 'id' | 'status' | 'createdAt'>) => MeetInvitation;
  updateMeetInvitation: (id: string, status: 'accepted' | 'rejected') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultFilter: GlobalFilterOptions = {
  categories: [],
  investmentMin: 0,
  investmentMax: 20000,
  investmentLevels: [],
  timeIntensities: [],
  roles: [],
  distanceMax: 30,
  sortBy: 'distance',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [savedUser] = useState<User>(() => safeGetStorage<User>(STORAGE_KEYS.USER, currentUser));
  const [savedProjects] = useState<Project[]>(() => safeGetStorage<Project[]>(STORAGE_KEYS.PROJECTS, mockProjects));
  const [savedFilter] = useState<GlobalFilterOptions | null>(() => safeGetStorage<GlobalFilterOptions | null>(STORAGE_KEYS.GLOBAL_FILTER, null));
  const [savedInvitations] = useState<MeetInvitation[]>(() => safeGetStorage<MeetInvitation[]>(STORAGE_KEYS.MEET_INVITATIONS, []));

  const [user, setUser] = useState<User>(savedUser);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(5);
  const [projects, setProjects] = useState<Project[]>(savedProjects);
  const [globalFilter, setGlobalFilter] = useState<GlobalFilterOptions | null>(savedFilter);
  const [meetInvitations, setMeetInvitations] = useState<MeetInvitation[]>(savedInvitations);

  useEffect(() => {
    if (!initializing) {
      safeSetStorage(STORAGE_KEYS.USER, user);
    }
  }, [user, initializing]);

  useEffect(() => {
    if (!initializing) {
      safeSetStorage(STORAGE_KEYS.PROJECTS, projects);
    }
  }, [projects, initializing]);

  useEffect(() => {
    if (!initializing) {
      safeSetStorage(STORAGE_KEYS.GLOBAL_FILTER, globalFilter);
    }
  }, [globalFilter, initializing]);

  useEffect(() => {
    if (!initializing) {
      safeSetStorage(STORAGE_KEYS.MEET_INVITATIONS, meetInvitations);
    }
  }, [meetInvitations, initializing]);

  useEffect(() => {
    const timer = setTimeout(() => setInitializing(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const allUsers = useMemo<User[]>(() => {
    const others = mockUsers.filter(u => u.id !== user.id);
    return [user, ...others];
  }, [user]);

  const getUserById = useCallback((id: string): User | undefined => {
    return allUsers.find(u => u.id === id);
  }, [allUsers]);

  const addProject = useCallback((project: Project) => {
    console.log('[AppContext] 添加新项目:', project.id, project.title);
    setProjects(prev => [project, ...prev]);
  }, []);

  const enrichPublisherBio = useCallback((projects: Project[], users: User[]): Project[] => {
    return projects.map(p => {
      if (p.publisher.bio) return p;
      const found = users.find(u => u.id === p.publisher.id || u.name === p.publisher.name);
      if (found && found.bio) {
        return { ...p, publisher: { ...p.publisher, bio: found.bio } };
      }
      return p;
    });
  }, []);

  const projectsWithBio = useMemo(
    () => enrichPublisherBio(projects, allUsers),
    [projects, allUsers, enrichPublisherBio]
  );

  const getMyPublishedProjects = useCallback((): Project[] => {
    return projects.filter(p => p.publisher.id === user.id || p.publisher.name === user.name);
  }, [projects, user]);

  const getMyJoinedProjects = useCallback((): Project[] => {
    return projects.filter(p => p.id.endsWith('_joined') || false);
  }, [projects]);

  const sendMeetInvitation = useCallback((invitation: Omit<MeetInvitation, 'id' | 'status' | 'createdAt'>): MeetInvitation => {
    const newInvitation: MeetInvitation = {
      ...invitation,
      id: 'meet_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    console.log('[AppContext] 发送见面邀约:', newInvitation);
    setMeetInvitations(prev => [newInvitation, ...prev]);
    setUnreadMessageCount(prev => prev + 1);
    return newInvitation;
  }, []);

  const updateMeetInvitation = useCallback((id: string, status: 'accepted' | 'rejected') => {
    console.log('[AppContext] 更新邀约状态:', id, status);
    setMeetInvitations(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status } : inv
    ));
  }, []);

  const value = useMemo<AppContextType>(() => ({
    user,
    setUser,
    unreadMessageCount,
    setUnreadMessageCount,
    allUsers,
    getUserById,
    projects: projectsWithBio,
    addProject,
    getMyPublishedProjects,
    getMyJoinedProjects,
    globalFilter,
    setGlobalFilter,
    meetInvitations,
    sendMeetInvitation,
    updateMeetInvitation,
  }), [
    user,
    unreadMessageCount,
    allUsers,
    getUserById,
    projectsWithBio,
    addProject,
    getMyPublishedProjects,
    getMyJoinedProjects,
    globalFilter,
    meetInvitations,
    sendMeetInvitation,
    updateMeetInvitation,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const DEFAULT_FILTER = defaultFilter;
