import React, { useMemo, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { PAGE_SIZE } from '@/utils';
import {
  useDeleteStaffMutation,
  useGetStaffListByLoginIdQuery,
} from '@/ducks/staff/query';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { StaffListRecords } from './StaffListRecords';
import { useLoginUser } from '@/libs/mantine/useLoginUser';

export const StaffList: NextPage = () => {
  const [page, setPage] = useState(1);
  const { loginUser } = useLoginUser();
  const {
    data: staffList,
    isLoading: getStaffListLoading,
    refetch,
  } = useGetStaffListByLoginIdQuery(loginUser?.id || '');
  const [deleteStaff] = useDeleteStaffMutation();

  const from = useMemo(() => {
    return (page - 1) * PAGE_SIZE;
  }, [page]);
  const to = useMemo(() => {
    return from + PAGE_SIZE;
  }, [from]);
  const records = useMemo(() => {
    return staffList?.slice(from, to);
  }, [staffList, page]);

  const handleDelete = async (id: string) => {
    const isOK = await CustomConfirm(
      '削除します。よろしいですか？',
      '確認画面'
    );
    isOK && (await deleteStaff(id));
    refetch();
  };

  return (
    <DataTable
      fetching={getStaffListLoading}
      striped
      highlightOnHover
      withBorder
      records={records || []}
      recordsPerPage={PAGE_SIZE}
      totalRecords={staffList?.length || 0}
      page={page}
      loaderBackgroundBlur={1}
      onPageChange={(p) => setPage(p)}
      columns={StaffListRecords({
        handleDelete,
      })}
    />
  );
};
