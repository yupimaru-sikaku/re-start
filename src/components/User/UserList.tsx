import React from 'react';
import { useGetUserListQuery } from '@/ducks/user/query';
import { UserTableList } from 'src/components/User/UserTableList';

export const UserList = () => {
  const { isLoading: userLoading } = useGetUserListQuery(undefined);
  return <UserTableList loading={userLoading} />;
};
