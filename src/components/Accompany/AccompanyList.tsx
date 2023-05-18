import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import {
  useGetAccompanyListByCorporateIdQuery,
  useGetAccompanyListByLoginIdQuery,
  useGetAccompanyListQuery,
} from '@/ducks/accompany/query';
import { TableList } from '../Common/TableList';

export const AccompanyList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const accompanyList = useSelector((state) => state.accompany.accompanyList);
  const data1 = useGetAccompanyListQuery(undefined, {
    skip: loginProviderInfo.role !== 'admin',
  });
  const data2 = useGetAccompanyListByCorporateIdQuery(loginProviderInfo.corporate_id, {
    skip: loginProviderInfo.role !== 'corporate',
  });
  const data3 = useGetAccompanyListByLoginIdQuery(loginProviderInfo.id, {
    skip: loginProviderInfo.role !== 'office',
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

  return <TableList path="ACCOMPANY_EDIT" loading={accompanyLoading} dataList={accompanyList} />;
};
