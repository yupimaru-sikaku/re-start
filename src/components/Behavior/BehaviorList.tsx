import {
  useDeleteBehaviorMutation,
  useGetBehaviorListByCorporateIdQuery,
  useGetBehaviorListByLoginIdQuery,
  useGetBehaviorListQuery,
} from '@/ducks/behavior/query';
import { RootState } from '@/ducks/root-reducer';
import { useSelector } from '@/ducks/store';
import React, { useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import { TableList } from '../Common/TableList';

export const BehaviorList: NextPage = () => {
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const data1 = useGetBehaviorListQuery();
  const data2 = useGetBehaviorListByCorporateIdQuery(
    loginProviderInfo.corporate_id
  );
  const data3 = useGetBehaviorListByLoginIdQuery(loginProviderInfo.id);
  const {
    data: behaviorList,
    isLoading: behaviorLoading,
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
  const [deleteBehavior] = useDeleteBehaviorMutation();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <TableList
      deleteAction={deleteBehavior}
      refetch={refetch}
      path="BEHAVIOR_EDIT"
      loading={behaviorLoading}
      dataList={behaviorList}
    />
  );
};
