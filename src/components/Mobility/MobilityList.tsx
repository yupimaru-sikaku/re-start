import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import {
  useGetMobilityListByCorporateIdQuery,
  useGetMobilityListByLoginIdQuery,
  useGetMobilityListQuery,
  useUpdateMobilityMutation,
} from '@/ducks/mobility/query';
import { TableRecordList } from '../Common/TableRecordList';

export const MobilityList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const mobilityList = useSelector((state) => state.mobility.mobilityList);
  const data1 = useGetMobilityListQuery(undefined, {
    skip: loginProviderInfo.role !== 'admin',
    refetchOnMountOrArgChange: true,
  });
  const data2 = useGetMobilityListByCorporateIdQuery(loginProviderInfo.corporate_id, {
    skip: loginProviderInfo.role !== 'corporate',
    refetchOnMountOrArgChange: true,
  });
  const data3 = useGetMobilityListByLoginIdQuery(loginProviderInfo.id, {
    skip: loginProviderInfo.role !== 'office',
    refetchOnMountOrArgChange: true,
  });
  const { isLoading: mobilityLoading } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else if (loginProviderInfo.role === 'corporate') {
      return data2;
    } else {
      return data3;
    }
  }, [data1, data2, data3]);
  const [updateMobility] = useUpdateMobilityMutation();

  return (
    <TableRecordList path="MOBILITY_EDIT" loading={mobilityLoading} dataList={mobilityList} updateRecord={updateMobility} />
  );
};
