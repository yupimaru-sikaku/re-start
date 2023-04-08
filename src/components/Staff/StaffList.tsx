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

type Props = {
  staffList: ReturnStaff[];
};

const PAGE_SIZE = 5;

export const StaffList: NextPage<Props> = ({ staffList }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(staffList.slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(staffList.slice(from, to));
  }, [page]);

  const handleShow = (): void => {};
  const handleEdit = (staff: ReturnStaff) => {
    router.push(`${getPath('STAFF_EDIT', staff.id)}`);
  };
  const handleDelete = async () => {};

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
        { accessor: 'work_time_per_week', title: '勤務時間/週' },
        {
          accessor: 'syoninsya',
          width: 70,
          textAlignment: 'center',
          title: '初任者',
          render: (staff) => <Checkbox readOnly checked={staff.is_syoninsya} />,
        },
        {
          accessor: 'kodo',
          width: 70,
          textAlignment: 'center',
          title: '行動援護',
          render: (staff) => <Checkbox readOnly checked={staff.is_kodo} />,
        },
        {
          accessor: 'doko_normal',
          width: 70,
          textAlignment: 'center',
          title: (
            <>
              同行援護
              <br />
              一般
            </>
          ),
          render: (staff) => (
            <Checkbox readOnly checked={staff.is_doko_normal} />
          ),
        },
        {
          accessor: 'doko_apply',
          width: 70,
          textAlignment: 'center',
          title: (
            <>
              同行援護
              <br />
              応用
            </>
          ),
          render: (staff) => (
            <Checkbox readOnly checked={staff.is_doko_apply} />
          ),
        },
        {
          accessor: 'iitsumusya',
          width: 70,
          textAlignment: 'center',
          title: '実務者',
          render: (staff) => (
            <Checkbox readOnly checked={staff.is_zitsumusya} />
          ),
        },
        {
          accessor: 'kaigo',
          width: 70,
          textAlignment: 'center',
          title: '介護福祉士',
          render: (staff) => <Checkbox readOnly checked={staff.is_kaigo} />,
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
        {
          accessor: 'actions',
          title: 'アクション',
          width: 110,
          render: (staff) => (
            <Group spacing={4} position="right" noWrap>
              <ActionIcon color="green" onClick={() => handleShow()}>
                <IconEye size={20} />
              </ActionIcon>
              <ActionIcon color="blue" onClick={() => handleEdit(staff)}>
                <IconEdit size={20} />
              </ActionIcon>
              <ActionIcon color="red" onClick={() => handleDelete()}>
                <IconTrash size={20} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
    />
  );
};
