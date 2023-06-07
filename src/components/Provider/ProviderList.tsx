import { useGetProviderListQuery } from '@/ducks/provider/query';
import { useSelector } from '@/ducks/store';
import React, { useMemo } from 'react';
import { TableProviderList } from './TableProviderList';

export const ProviderList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const providerList = useSelector((state) => state.provider.providerList);
  const { isLoading: providerLoading } = useGetProviderListQuery(undefined);
  const selectedProviderList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return providerList;
      case 'corporate':
      case 'office':
        return providerList.filter((provider) => provider.corporate_id === loginProviderInfo.corporate_id);
      default:
        return [];
    }
  }, [providerList, loginProviderInfo]);

  return <TableProviderList loading={providerLoading} dataList={selectedProviderList} />;
};
