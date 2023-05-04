import React, { useMemo, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { PAGE_SIZE } from '@/utils';
import {
  useDeleteStaffMutation,
  useGetStaffListQuery,
} from '@/ducks/staff/query';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { StaffListRecords } from './StaffListRecords';
import { useGetTablePage } from '@/hooks/useGetTablePage';

export const StaffList: NextPage = () => {
  const [page, setPage] = useState(1);
  const {
    data: staffList,
    isLoading: getStaffListLoading,
    refetch,
  } = useGetStaffListQuery();
  const [deleteStaff] = useDeleteStaffMutation();
  const { records, PAGE_SIZE } = useGetTablePage(page, staffList);

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
