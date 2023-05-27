import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import { useGetAccompanyListQuery, useUpdateAccompanyMutation } from '@/ducks/accompany/query';
import { TableRecordList } from 'src/components/Common/TableRecordList';

export const AccompanyList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const accompanyList = useSelector((state) => state.accompany.accompanyList);
  const { isLoading: accompanyLoading } = useGetAccompanyListQuery(undefined);
  const selectedAccompanyList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return accompanyList;
      case 'corporate':
        return accompanyList.filter((accompany) => accompany.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return accompanyList.filter((accompany) => accompany.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [accompanyList, loginProviderInfo]);
  const [updateAccompany] = useUpdateAccompanyMutation();

  return (
    <TableRecordList
      path="ACCOMPANY_EDIT"
      loading={accompanyLoading}
      dataList={selectedAccompanyList}
      updateRecord={updateAccompany}
    />
  );
};
