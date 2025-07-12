import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  _id: string;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuthenticated: (user: User | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setAuthenticated = (user: User | null) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      setAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
