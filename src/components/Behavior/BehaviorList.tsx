import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import { useGetBehaviorListQuery, useUpdateBehaviorMutation } from '@/ducks/behavior/query';
import { TableRecordList } from '../Common/TableRecordList';

export const BehaviorList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const behaviorList = useSelector((state) => state.behavior.behaviorList);
  const { isLoading: behaviorLoading } = useGetBehaviorListQuery(undefined);
  const selectedBehaviorList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return behaviorList;
      case 'corporate':
        return behaviorList.filter((behavior) => behavior.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return behaviorList.filter((behavior) => behavior.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [behaviorList, loginProviderInfo]);
  const [updateBehavior] = useUpdateBehaviorMutation();

  return (
    <TableRecordList
      path="BEHAVIOR_EDIT"
      loading={behaviorLoading}
      dataList={selectedBehaviorList}
      updateRecord={updateBehavior}
    />
  );
};
