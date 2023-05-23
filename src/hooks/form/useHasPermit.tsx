import React from 'react';
import { useSelector } from '@/ducks/store';

export const useHasPermit = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);

  const hasPermit = (statusId: number, type: string) => {
    switch (type) {
      case 'submit':
        return statusId === 0 && (loginProviderInfo.role === 'admin' || loginProviderInfo.role === 'corporate');
      case 'apply':
        return statusId === 1 && loginProviderInfo.role === 'admin';
      case 'reject':
      case 'done':
        return statusId === 2 && loginProviderInfo.role === 'admin';
      case 'download':
        return statusId !== 0;
      // 記録票の修正権限
      case 'enableEdit':
        return statusId === 0 || loginProviderInfo.role === 'admin';
      default:
        return true;
    }
  };

  return { hasPermit };
};
