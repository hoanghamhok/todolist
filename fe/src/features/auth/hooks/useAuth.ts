import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import type { AuthContextType } from '../type';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

