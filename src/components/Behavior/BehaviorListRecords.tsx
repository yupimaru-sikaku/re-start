import { convertSupabaseTime } from '@/utils';
import React from 'react';
import { CustomButton } from '../Common/CustomButton';
import { ActionIcon, Group } from '@mantine/core';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';
import { IconEdit, IconTrash } from '@tabler/icons';
import { ReturnBehavior } from '@/ducks/behavior/slice';

type Props = {
  handleDelete: (id: string) => Promise<void>;
  handlePDFDownload: (Behavior: ReturnBehavior) => Promise<void>;
};

export const BehaviorListRecords = ({
  handleDelete,
  handlePDFDownload,
}: Props) => {
  return [
    { accessor: 'year', title: '西暦', width: 110 },
    { accessor: 'month', title: '月', width: 110 },
    { accessor: 'name', title: '利用者名' },
    {
      accessor: 'download',
      title: 'ダウンロード',
      width: 150,
      render: (Behavior: ReturnBehavior) => (
        <CustomButton
          color="cyan"
          variant="light"
          onClick={() => handlePDFDownload(Behavior)}
        >
          ダウンロード
        </CustomButton>
      ),
    },

    {
      accessor: 'actions',
      title: 'アクション',
      width: 90,
      render: (Behavior: ReturnBehavior) => (
        <Group spacing={4} position="right" noWrap>
          <Link href={getPath('MOBILITY_SUPPORT_EDIT', Behavior.id)}>
            <a>
              <ActionIcon color="blue">
                <IconEdit size={20} />
              </ActionIcon>
            </a>
          </Link>
          <ActionIcon
            color="red"
            onClick={() => handleDelete(Behavior.id)}
          >
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      ),
    },
    {
      accessor: 'updatedAt',
      title: '更新日時',
      width: 150,
      render: (Behavior: ReturnBehavior) =>
        Behavior.updated_at
          ? convertSupabaseTime(Behavior.updated_at)
          : '',
    },
  ];
};
