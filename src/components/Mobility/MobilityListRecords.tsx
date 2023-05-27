import { convertSupabaseTime } from '@/utils';
import React from 'react';
import { CustomButton } from '../Common/CustomButton';
import { ActionIcon, Group } from '@mantine/core';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';
import { IconEdit, IconTrash } from '@tabler/icons';
import { ReturnMobility } from '@/ducks/mobility/slice';

type Props = {
  handleDelete: (id: string) => Promise<void>;
  handlePDFDownload: (Mobility: ReturnMobility) => Promise<void>;
};

export const MobilityListRecords = ({ handleDelete, handlePDFDownload }: Props) => {
  return [
    { accessor: 'year', title: '西暦', width: 110 },
    { accessor: 'month', title: '月', width: 110 },
    { accessor: 'name', title: '利用者名' },
    {
      accessor: 'download',
      title: 'ダウンロード',
      width: 150,
      render: (Mobility: ReturnMobility) => (
        <CustomButton color="cyan" variant="light" onClick={() => handlePDFDownload(Mobility)}>
          ダウンロード
        </CustomButton>
      ),
    },

    {
      accessor: 'actions',
      title: 'アクション',
      width: 90,
      render: (Mobility: ReturnMobility) => (
        <Group spacing={4} position="right" noWrap>
          <Link href={getPath('MOBILITY_EDIT', Mobility.id)}>
            <a>
              <ActionIcon color="blue">
                <IconEdit size={20} />
              </ActionIcon>
            </a>
          </Link>
          <ActionIcon color="red" onClick={() => handleDelete(Mobility.id)}>
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      ),
    },
    {
      accessor: 'updatedAt',
      title: '更新日時',
      width: 150,
      render: (Mobility: ReturnMobility) => (Mobility.updated_at ? convertSupabaseTime(Mobility.updated_at) : ''),
    },
  ];
};
