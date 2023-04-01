import { AuthContext } from '@/pages/_app';
import { useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthContext.Provider');
  }

  return context;
};
