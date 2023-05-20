import React, { useMemo } from 'react';
import { useGetUserListByCorporateIdQuery, useGetUserListQuery } from '@/ducks/user/query';
import { useSelector } from '@/ducks/store';
import { UserTableList } from 'src/components/User/UserTableList';

export const UserList = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const userList = useSelector((state) => state.user.userList);
  const data1 = useGetUserListQuery();
  const data2 = useGetUserListByCorporateIdQuery(loginProviderInfo.corporate_id, {
    skip: loginProviderInfo.role !== 'corporate',
  });
  const { isLoading: userLoading } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else {
      return data2;
    }
  }, [data1, data2]);

  return <UserTableList loading={userLoading} dataList={userList} />;
};
