import { AuthContext } from '@/pages/_app';
import { useContext } from 'react';

export const useLoginUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useLoginUser must be used within an AuthContext.Provider');
  }

  return context;
};
