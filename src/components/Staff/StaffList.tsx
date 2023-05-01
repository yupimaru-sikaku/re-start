import React, { useMemo, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { PAGE_SIZE } from '@/utils';
import { useRouter } from 'next/router';
import { ReturnStaff } from '@/ducks/staff/slice';
import { getPath } from '@/utils/const/getPath';
import {
  useDeleteStaffMutation,
  useGetStaffListQuery,
} from '@/ducks/staff/query';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { StaffListRecords } from './StaffListRecords';

export const StaffList: NextPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: staffList, isLoading } = useGetStaffListQuery();
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

  const handleEdit = (staff: ReturnStaff) => {
    router.push(`${getPath('STAFF_EDIT', staff.id)}`);
  };
  const handleDelete = async (id: string) => {
    const isOK = await CustomConfirm(
      '削除します。よろしいですか？',
      '確認画面'
    );
    isOK && (await deleteStaff(id));
  };
  const moveToPersonalSchedule = (id: string) => {
    router.push(getPath('STAFF_SCHEDULE', id));
  };

  return (
    <DataTable
      fetching={isLoading}
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
        handleEdit,
        handleDelete,
        moveToPersonalSchedule,
      })}
    />
  );
};
