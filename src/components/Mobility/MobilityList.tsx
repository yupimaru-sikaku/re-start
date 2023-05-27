import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import { useGetMobilityListQuery, useUpdateMobilityMutation } from '@/ducks/mobility/query';
import { TableRecordList } from '../Common/TableRecordList';

export const MobilityList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const mobilityList = useSelector((state) => state.mobility.mobilityList);
  const { isLoading: mobilityLoading } = useGetMobilityListQuery(undefined);
  const selectedMobilityList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return mobilityList;
      case 'corporate':
        return mobilityList.filter((mobility) => mobility.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return mobilityList.filter((mobility) => mobility.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [mobilityList, loginProviderInfo]);
  const [updateMobility] = useUpdateMobilityMutation();

  return (
    <TableRecordList
      path="MOBILITY_EDIT"
      loading={mobilityLoading}
      dataList={selectedMobilityList}
      updateRecord={updateMobility}
    />
  );
};
