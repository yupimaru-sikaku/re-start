import React, { useEffect, useMemo } from 'react';
import {
  useDeleteAccompanyMutation,
  useGetAccompanyListByCorporateIdQuery,
  useGetAccompanyListByLoginIdQuery,
  useGetAccompanyListQuery,
} from '@/ducks/accompany/query';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { TableList } from '../Common/TableList';

export const AccompanyList = () => {
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const data1 = useGetAccompanyListQuery();
  const data2 = useGetAccompanyListByCorporateIdQuery(
    loginProviderInfo.corporate_id
  );
  const data3 = useGetAccompanyListByLoginIdQuery(loginProviderInfo.id);
  const {
    data: accompanyList,
    isLoading: accompanyLoading,
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
  const [deleteAccompany] = useDeleteAccompanyMutation();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <TableList
      deleteAction={deleteAccompany}
      refetch={refetch}
      path="ACCOMPANY_EDIT"
      loading={accompanyLoading}
      dataList={accompanyList}
    />
  );
};
