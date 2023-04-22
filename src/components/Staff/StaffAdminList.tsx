import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { convertSupabaseTime } from '@/utils';
import { User } from '@/ducks/user/slice';
import { ActionIcon, Box, Checkbox, Group, Text } from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons';
import { IconEdit } from '@tabler/icons';
import { useRouter } from 'next/router';
import { ReturnStaff } from '@/ducks/staff/slice';
import { getPath } from '@/utils/const/getPath';
import { CustomButton } from '../Common/CustomButton';

type Props = {
  staffList: ReturnStaff[];
};

const PAGE_SIZE = 5;

export const StaffAdminList: NextPage<Props> = ({ staffList }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(staffList.slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(staffList.slice(from, to));
  }, [page]);

  const moveToPersonalShedule = (id: string) => {
    router.push()
  }

  return (
    <DataTable
      sx={{ width: '1000px' }}
      verticalSpacing="lg"
      striped
      highlightOnHover
      withBorder
      records={records}
      recordsPerPage={PAGE_SIZE}
      totalRecords={staffList.length}
      page={page}
      loaderVariant="oval"
      loaderSize="lg"
      loaderBackgroundBlur={1}
      onPageChange={(p) => setPage(p)}
      columns={[
        { accessor: 'name', title: '名前', width: 110 },
        { accessor: 'gender', title: '性別' },
        {
          accessor: 'download',
          title: 'ダウンロード',
          width: 150,
          render: (staff) => (
            <CustomButton
              color="cyan"
              variant="light"
              onClick={() => moveToPersonalShedule(staff.id)}
            >
              勤怠画面に移動
            </CustomButton>
          ),
        },

        {
          accessor: 'created_at',
          textAlignment: 'center',
          title: '作成日時',
          width: 150,
          render: (user) => convertSupabaseTime(user.created_at),
        },
        {
          accessor: 'updatedAt',
          textAlignment: 'center',
          title: '更新日時',
          width: 150,
          render: (staff) => convertSupabaseTime(staff.updated_at),
        },
      ]}
    />
  );
};
