import {
  useDeleteMobilityMutation,
  useGetMobilityListByCorporateIdQuery,
  useGetMobilityListByLoginIdQuery,
  useGetMobilityListQuery,
} from '@/ducks/mobility/query';
import { RootState } from '@/ducks/root-reducer';
import { useSelector } from '@/ducks/store';
import React, { useEffect, useMemo } from 'react';
import { TableList } from '../Common/TableList';

export const MobilityList = () => {
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const data1 = useGetMobilityListQuery();
  const data2 = useGetMobilityListByCorporateIdQuery(
    loginProviderInfo.corporate_id
  );
  const data3 = useGetMobilityListByLoginIdQuery(loginProviderInfo.id);
  const [deleteMobility] = useDeleteMobilityMutation();
  const {
    data: mobilityList,
    isLoading: mobilityLoading,
    refetch,
  } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else if (loginProviderInfo.role === 'corporate') {
      return data2;
    } else {
      return data3;
    }
  }, [data1, data2, data3]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <TableList
      deleteAction={deleteMobility}
      refetch={refetch}
      path="MOBILITY_EDIT"
      loading={mobilityLoading}
      dataList={mobilityList}
    />
  );
};
