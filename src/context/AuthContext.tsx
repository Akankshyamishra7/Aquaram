'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, role?: 'admin' | 'customer') => void;
  logout: () => void;
  toggleRole: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr-admin-01',
  name: 'Akanksha (Aquaram Admin)',
  email: 'admin@aquaram.in',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aquaram_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore
    }
  }, []);

  const login = (email: string, role: 'admin' | 'customer' = 'customer') => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    setUser(newUser);
    localStorage.setItem('aquaram_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aquaram_user');
  };

  const toggleRole = () => {
    setUser((prev) => {
      if (!prev) return DEFAULT_USER;
      const nextRole: 'admin' | 'customer' = prev.role === 'admin' ? 'customer' : 'admin';
      const updated: User = {
        ...prev,
        role: nextRole,
        name: nextRole === 'admin' ? 'Akanksha (Aquaram Admin)' : 'Akanksha (Valued Customer)',
      };
      localStorage.setItem('aquaram_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        toggleRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
