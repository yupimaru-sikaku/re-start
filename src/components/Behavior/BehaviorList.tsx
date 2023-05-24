import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import {
  useGetBehaviorListByCorporateIdQuery,
  useGetBehaviorListByLoginIdQuery,
  useGetBehaviorListQuery,
  useUpdateBehaviorMutation,
} from '@/ducks/behavior/query';
import { TableRecordList } from '../Common/TableRecordList';

export const BehaviorList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const behaviorList = useSelector((state) => state.behavior.behaviorList);
  const data1 = useGetBehaviorListQuery(undefined, {
    skip: loginProviderInfo.role !== 'admin',
  });
  const data2 = useGetBehaviorListByCorporateIdQuery(loginProviderInfo.corporate_id, {
    skip: loginProviderInfo.role !== 'corporate',
  });
  const data3 = useGetBehaviorListByLoginIdQuery(loginProviderInfo.id, {
    skip: loginProviderInfo.role !== 'office',
  });
  const { isLoading: behaviorLoading } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else if (loginProviderInfo.role === 'corporate') {
      return data2;
    } else {
      return data3;
    }
  }, [data1, data2, data3]);
  const [updateBehavior] = useUpdateBehaviorMutation();

  return (
    <TableRecordList path="BEHAVIOR_EDIT" loading={behaviorLoading} dataList={behaviorList} updateRecord={updateBehavior} />
  );
};
