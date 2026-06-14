import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/user';
import { currentUser } from '@/data/users';

interface AppContextType {
  user: User;
  setUser: (user: User) => void;
  unreadMessageCount: number;
  setUnreadMessageCount: (count: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(currentUser);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(5);

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      unreadMessageCount, 
      setUnreadMessageCount 
    }}>
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
