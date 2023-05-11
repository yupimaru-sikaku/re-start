import { convertSupabaseTime } from '@/utils';
import React from 'react';
import { CustomButton } from '../Common/CustomButton';
import { ActionIcon, Group } from '@mantine/core';
import { getPath } from '@/utils/const/getPath';
import { IconEdit, IconTrash } from '@tabler/icons';
import { ReturnAccompany } from '@/ducks/accompany/slice';
import Link from 'next/link';

type Props = {
  handleDelete: (id: string) => Promise<void>;
  handlePDFDownload: (accompany: ReturnAccompany) => Promise<void>;
};

export const AccompanyListRecords = ({
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
      render: (accompany: ReturnAccompany) => (
        <CustomButton
          color="cyan"
          variant="light"
          onClick={() => handlePDFDownload(accompany)}
        >
          ダウンロード
        </CustomButton>
      ),
    },
    {
      accessor: 'actions',
      title: 'アクション',
      width: 90,
      render: (accompany: ReturnAccompany) => (
        <Group spacing={4} position="right" noWrap>
          <Link href={getPath('ACCOMPANY_EDIT', accompany.id)}>
            <a>
              <ActionIcon color="blue">
                <IconEdit size={20} />
              </ActionIcon>
            </a>
          </Link>
          <ActionIcon color="red" onClick={() => handleDelete(accompany.id)}>
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      ),
    },
    {
      accessor: 'updatedAt',
      title: '更新日時',
      width: 150,
      render: (accompany: ReturnAccompany) =>
        accompany.updated_at ? convertSupabaseTime(accompany.updated_at) : '',
    },
  ];
};
