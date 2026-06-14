import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { User } from '@/types/user';
import { Project, InvestmentLevel, TimeIntensity, ProjectCategory } from '@/types/project';
import { currentUser, mockUsers } from '@/data/users';
import { mockProjects } from '@/data/projects';

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
  const [user, setUser] = useState<User>(currentUser);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(5);
  const [allUsers] = useState<User[]>([currentUser, ...mockUsers]);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [globalFilter, setGlobalFilter] = useState<GlobalFilterOptions | null>(null);
  const [meetInvitations, setMeetInvitations] = useState<MeetInvitation[]>([]);

  const getUserById = useCallback((id: string): User | undefined => {
    return allUsers.find(u => u.id === id);
  }, [allUsers]);

  const addProject = useCallback((project: Project) => {
    console.log('[AppContext] 添加新项目:', project.id, project.title);
    setProjects(prev => [project, ...prev]);
  }, []);

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
    projects,
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
    projects,
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
