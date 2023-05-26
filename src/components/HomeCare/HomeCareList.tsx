import React, { useMemo } from 'react';
import { useSelector } from '@/ducks/store';
import {
  useGetHomeCareListQuery,
  useGetHomeCareListByCorporateIdQuery,
  useGetHomeCareListByLoginIdQuery,
  useUpdateHomeCareMutation,
} from '@/ducks/home-care/query';
import { TableRecordList } from 'src/components/Common/TableRecordList';

export const HomeCareList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const homeCareList = useSelector((state) => state.homeCare.homeCareList);
  const data1 = useGetHomeCareListQuery(undefined, {
    skip: loginProviderInfo.role !== 'admin',
    refetchOnMountOrArgChange: true,
  });
  const data2 = useGetHomeCareListByCorporateIdQuery(loginProviderInfo.corporate_id, {
    skip: loginProviderInfo.role !== 'corporate',
    refetchOnMountOrArgChange: true,
  });
  const data3 = useGetHomeCareListByLoginIdQuery(loginProviderInfo.id, {
    skip: loginProviderInfo.role !== 'office',
    refetchOnMountOrArgChange: true,
  });
  const { isLoading: homeCareLoading } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else if (loginProviderInfo.role === 'corporate') {
      return data2;
    } else {
      return data3;
    }
  }, [data1, data2, data3]);
  const [updateHomeCare] = useUpdateHomeCareMutation();

  return (
    <TableRecordList path="HOME_CARE_EDIT" loading={homeCareLoading} dataList={homeCareList} updateRecord={updateHomeCare} />
  );
};
