import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { convertSupabaseTime } from '@/utils';
import { User } from '@/ducks/user/slice';
import { ActionIcon, Box, Checkbox, Group, Text } from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons';
import { IconEdit } from '@tabler/icons';
import { useRouter } from 'next/router';

type Props = {
  userList: User[];
};

const PAGE_SIZE = 5;

export const UserList: NextPage<Props> = ({ userList }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(userList.slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(userList.slice(from, to));
  }, [page]);

  const handleShow = (user: User): void => {};
  const handleEdit = (user: User): void => {};
  const handleDelete = async (user: User) => {};

  return (
    <DataTable
      sx={{ width: '1000px' }}
      verticalSpacing="lg"
      striped
      highlightOnHover
      withBorder
      records={records}
      recordsPerPage={PAGE_SIZE}
      totalRecords={userList.length}
      page={page}
      loaderVariant="oval"
      loaderSize="lg"
      loaderBackgroundBlur={1}
      onPageChange={(p) => setPage(p)}
      columns={[
        { accessor: 'name', title: '名前', width: 110 },
        { accessor: 'gender', title: '性別' },
        {
          accessor: 'gender_specification',
          title: (
            <>
              性別
              <br />
              指定
            </>
          ),
        },
        {
          accessor: 'ido',
          width: 70,
          textAlignment: 'center',
          title: (
            <>
              移動
              <br />
              支援
            </>
          ),
          render: (user) => <Checkbox readOnly checked={user.is_ido} />,
        },
        {
          accessor: 'kodo',
          width: 70,
          textAlignment: 'center',
          title: (
            <>
              行動
              <br />
              援護
            </>
          ),
          render: (user) => <Checkbox readOnly checked={user.is_kodo} />,
        },
        {
          accessor: 'doko',
          width: 70,
          textAlignment: 'center',
          title: (
            <>
              同行
              <br />
              援護
            </>
          ),
          render: (user) => <Checkbox readOnly checked={user.is_doko} />,
        },
        {
          accessor: 'kazi',
          width: 70,
          textAlignment: 'center',
          title: (
            <>
              家事
              <br />
              援助
            </>
          ),
          render: (user) => <Checkbox readOnly checked={user.is_kazi} />,
        },
        {
          accessor: 'shintai',
          width: 70,
          textAlignment: 'center',
          title: (
            <>
              身体
              <br />
              介護
            </>
          ),
          render: (user) => <Checkbox readOnly checked={user.is_shintai} />,
        },
        {
          accessor: 'with_tsuin',
          textAlignment: 'center',
          title: (
            <>
              通院等介助
              <br />
              （伴う）
            </>
          ),
          render: (user) => <Checkbox readOnly checked={user.is_with_tsuin} />,
        },
        {
          accessor: 'tsuin',
          textAlignment: 'center',
          title: (
            <>
              通院等介助
              <br />
              （伴わない）
            </>
          ),
          render: (user) => <Checkbox readOnly checked={user.is_tsuin} />,
        },
        {
          accessor: 'created_at',
          textAlignment: 'center',
          title: '作成日時',
          width: 150,
          render: (user) =>
            user.created_at ? convertSupabaseTime(user.created_at) : '',
        },
        {
          accessor: 'updatedAt',
          textAlignment: 'center',
          title: '更新日時',
          width: 150,
          render: (user) =>
            user.updated_at ? convertSupabaseTime(user.updated_at) : '',
        },
        {
          accessor: 'actions',
          title: 'アクション',
          width: 110,
          render: (user) => (
            <Group spacing={4} position="right" noWrap>
              <ActionIcon color="green" onClick={() => handleShow(user)}>
                <IconEye size={20} />
              </ActionIcon>
              <ActionIcon color="blue" onClick={() => handleEdit(user)}>
                <IconEdit size={20} />
              </ActionIcon>
              <ActionIcon color="red" onClick={() => handleDelete(user)}>
                <IconTrash size={20} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
    />
  );
};
