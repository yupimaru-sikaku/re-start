import { useGetProviderListByCorporateIdQuery } from '@/ducks/provider/query';
import { useSelector } from '@/ducks/store';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { TableProviderList } from './TableProviderList';

export const ProviderList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const providerList = useSelector((state) => state.provider.providerList);
  const { isLoading: providerLoading } = useGetProviderListByCorporateIdQuery(loginProviderInfo.corporate_id || skipToken);

  return <TableProviderList loading={providerLoading} dataList={providerList} />;
};
