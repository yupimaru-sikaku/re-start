import React, { useMemo, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { PAGE_SIZE } from '@/utils';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { UserListRecords } from 'src/components/User/UserListRecords';
import {
  useDeleteUserMutation,
  useGetUserListByLoginIdQuery,
  useGetUserListQuery,
} from '@/ducks/user/query';
import { useLoginUser } from '@/libs/mantine/useLoginUser';

export const UserList: NextPage = () => {
  const [page, setPage] = useState(1);
  const { loginUser, provider } = useLoginUser();
  const {
    data: userListByLoginId,
    isLoading: userListByLoginIdLoading,
    refetch: userListByLoginIdRefetch,
  } = useGetUserListByLoginIdQuery(loginUser?.id || '');
  const {
    data: userListAll,
    isLoading: userListAllLoading,
    refetch: userListAllRefetch,
  } = useGetUserListQuery();
  const userList = provider?.role === 'admin' ? userListAll : userListByLoginId;
  const useListLoading =
    provider?.role === 'admin' ? userListAllLoading : userListByLoginIdLoading;
  const [deleteUser] = useDeleteUserMutation();
  const from = useMemo(() => {
    return (page - 1) * PAGE_SIZE;
  }, [page]);
  const to = useMemo(() => {
    return from + PAGE_SIZE;
  }, [from]);
  const records = useMemo(() => {
    return userList?.slice(from, to);
  }, [userList, page]);

  const handleDelete = async (id: string) => {
    const isOK = await CustomConfirm(
      '削除します。よろしいですか？',
      '確認画面'
    );
    isOK && (await deleteUser(id));
    provider?.role === 'admin'
      ? userListAllRefetch()
      : userListByLoginIdRefetch();
  };

  return (
    <DataTable
      fetching={useListLoading}
      striped
      highlightOnHover
      withBorder
      records={records || []}
      recordsPerPage={PAGE_SIZE}
      totalRecords={userList?.length || 0}
      page={page}
      loaderBackgroundBlur={1}
      onPageChange={(p) => setPage(p)}
      columns={UserListRecords({
        handleDelete,
      })}
    />
  );
};
