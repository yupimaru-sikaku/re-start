import React, { useMemo, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { UserListRecords } from 'src/components/User/UserListRecords';
import {
  useDeleteUserMutation,
  useGetUserListByLoginIdQuery,
  useGetUserListQuery,
} from '@/ducks/user/query';
import { useGetTablePage } from '@/hooks/table/useGetTablePage';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';

export const UserList: NextPage = () => {
  const [page, setPage] = useState(1);
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const data1 = useGetUserListQuery();
  const data2 = useGetUserListByLoginIdQuery(
    loginProviderInfo.id || ''
  );
  const {
    data: userList,
    isLoading: userListLoading,
    refetch,
  } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else {
      return data2;
    }
  }, [data1, data2]);
  const [deleteUser] = useDeleteUserMutation();
  const { records, PAGE_SIZE } = useGetTablePage(page, userList);
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
      fetching={userListLoading}
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
