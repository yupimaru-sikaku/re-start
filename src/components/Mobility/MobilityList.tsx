import React, { useMemo } from 'react';
import {
  useDeleteMobilityMutation,
  useGetMobilityListByCorporateIdQuery,
  useGetMobilityListByLoginIdQuery,
  useGetMobilityListQuery,
} from '@/ducks/mobility/query';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { TableList } from '../Common/TableList';

export const MobilityList = () => {
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const data1 = useGetMobilityListQuery(undefined, {
    skip: loginProviderInfo.role !== 'admin',
  });
  const data2 = useGetMobilityListByCorporateIdQuery(
    loginProviderInfo.corporate_id,
    { skip: loginProviderInfo.role !== 'corporate' }
  );
  const data3 = useGetMobilityListByLoginIdQuery(loginProviderInfo.id, {
    skip: loginProviderInfo.role !== 'office',
  });
  const { data: mobilityList, isLoading: mobilityLoading } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else if (loginProviderInfo.role === 'corporate') {
      return data2;
    } else {
      return data3;
    }
  }, [data1, data2, data3]);
  const [deleteMobility] = useDeleteMobilityMutation();

  return (
    <TableList
      deleteAction={deleteMobility}
      path="MOBILITY_EDIT"
      loading={mobilityLoading}
      dataList={mobilityList}
    />
  );
};
