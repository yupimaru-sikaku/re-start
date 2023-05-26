import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import {
  useGetAccompanyListQuery,
  useGetAccompanyListByCorporateIdQuery,
  useGetAccompanyListByLoginIdQuery,
  useUpdateAccompanyMutation,
} from '@/ducks/accompany/query';
import { TableRecordList } from 'src/components/Common/TableRecordList';

export const AccompanyList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const accompanyList = useSelector((state) => state.accompany.accompanyList);
  const data1 = useGetAccompanyListQuery(undefined, {
    skip: loginProviderInfo.role !== 'admin',
    refetchOnMountOrArgChange: true,
  });
  const data2 = useGetAccompanyListByCorporateIdQuery(loginProviderInfo.corporate_id, {
    skip: loginProviderInfo.role !== 'corporate',
    refetchOnMountOrArgChange: true,
  });
  const data3 = useGetAccompanyListByLoginIdQuery(loginProviderInfo.id, {
    skip: loginProviderInfo.role !== 'office',
    refetchOnMountOrArgChange: true,
  });
  const { isLoading: accompanyLoading } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else if (loginProviderInfo.role === 'corporate') {
      return data2;
    } else {
      return data3;
    }
  }, [data1, data2, data3]);
  const [updateAccompany] = useUpdateAccompanyMutation();

  return (
    <TableRecordList path="ACCOMPANY_EDIT" loading={accompanyLoading} dataList={accompanyList} updateRecord={updateAccompany} />
  );
};
