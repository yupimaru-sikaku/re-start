import React from 'react';
import { convertSupabaseTime } from '@/utils';
import { ActionIcon, Checkbox, Group } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { IconEdit } from '@tabler/icons';
import { CustomButton } from '../Common/CustomButton';
import { ReturnStaff } from '@/ducks/staff/slice';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';
import { ReturnUser } from '@/ducks/user/slice';

type Props = {
  handleDelete: (id: string) => Promise<void>;
};

export const UserListRecords = ({ handleDelete }: Props) => {
  return [
    { accessor: 'name', title: '名前', width: 110 },
    { accessor: 'gender', title: '性別', width: 50 },
    {
      accessor: 'gender_specification',
      title: (
        <>
          性別
          <br />
          指定
        </>
      ),
      width: 50,
    },
    {
      accessor: 'ido',
      width: 50,
      title: (
        <>
          移動
          <br />
          支援
        </>
      ),
      render: (user: ReturnUser) => <Checkbox readOnly checked={user.is_ido} />,
    },
    {
      accessor: 'kodo',
      width: 50,
      title: (
        <>
          行動
          <br />
          援護
        </>
      ),
      render: (user: ReturnUser) => (
        <Checkbox readOnly checked={user.is_kodo} />
      ),
    },
    {
      accessor: 'doko',
      width: 50,
      title: (
        <>
          同行
          <br />
          援護
        </>
      ),
      render: (user: ReturnUser) => (
        <Checkbox readOnly checked={user.is_doko} />
      ),
    },
    {
      accessor: 'kazi',
      width: 50,
      title: (
        <>
          家事
          <br />
          援助
        </>
      ),
      render: (user: ReturnUser) => (
        <Checkbox readOnly checked={user.is_kazi} />
      ),
    },
    {
      accessor: 'shintai',
      width: 50,
      title: (
        <>
          身体
          <br />
          介護
        </>
      ),
      render: (user: ReturnUser) => (
        <Checkbox readOnly checked={user.is_shintai} />
      ),
    },
    {
      accessor: 'with_tsuin',
      title: (
        <>
          通院等介助
          <br />
          （伴う）
        </>
      ),
      width: 60,
      render: (user: ReturnUser) => (
        <Checkbox readOnly checked={user.is_with_tsuin} />
      ),
    },
    {
      accessor: 'tsuin',
      title: (
        <>
          通院等介助
          <br />
          （伴わない）
        </>
      ),
      width: 60,
      render: (user: ReturnUser) => (
        <Checkbox readOnly checked={user.is_tsuin} />
      ),
    },
    {
      accessor: 'created_at',
      title: '作成日時',
      width: 70,
      render: (user: ReturnUser) =>
        user.created_at ? convertSupabaseTime(user.created_at) : '',
    },
    {
      accessor: 'updatedAt',
      title: '更新日時',
      width: 70,
      render: (user: ReturnUser) =>
        user.updated_at ? convertSupabaseTime(user.updated_at) : '',
    },
    {
      accessor: 'actions',
      title: 'アクション',
      width: 90,
      render: (user: ReturnUser) => (
        <Group spacing={4} noWrap>
          <Link href={getPath('USER_EDIT', user.id)}>
            <a>
              <ActionIcon color="blue">
                <IconEdit size={20} />
              </ActionIcon>
            </a>
          </Link>
          <ActionIcon color="red" onClick={() => handleDelete(user.id)}>
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      ),
    },
  ];
};
