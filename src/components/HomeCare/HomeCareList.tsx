import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import { useGetHomeCareListQuery, useUpdateHomeCareMutation } from '@/ducks/home-care/query';
import { TableRecordList } from '@/components/Common/TableRecordList';

export const HomeCareList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const homeCareList = useSelector((state) => state.homeCare.homeCareList);
  const { isLoading: homeCareLoading } = useGetHomeCareListQuery(undefined);
  const selectedHomeCareList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return homeCareList;
      case 'corporate':
        return homeCareList.filter((homeCare) => homeCare.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return homeCareList.filter((homeCare) => homeCare.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [homeCareList, loginProviderInfo]);
  const [updateHomeCare] = useUpdateHomeCareMutation();

  return (
    <TableRecordList
      path="HOME_CARE_EDIT"
      loading={homeCareLoading}
      dataList={selectedHomeCareList}
      updateRecord={updateHomeCare}
    />
  );
};
