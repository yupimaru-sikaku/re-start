import React, { useMemo, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { PAGE_SIZE } from '@/utils';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { UserListRecords } from 'src/components/User/UserListRecords';
import {
  useDeleteUserMutation,
  useGetUserListByLoginIdQuery,
} from '@/ducks/user/query';
import { useLoginUser } from '@/libs/mantine/useLoginUser';

export const UserList: NextPage = () => {
  const [page, setPage] = useState(1);
  const { loginUser } = useLoginUser();
  const {
    data: userList,
    isLoading: useGetStaffLoading,
    refetch,
  } = useGetUserListByLoginIdQuery(loginUser?.id || '');
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
    refetch();
  };

  return (
    <DataTable
      fetching={useGetStaffLoading}
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
