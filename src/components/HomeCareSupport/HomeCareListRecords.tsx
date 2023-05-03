import { convertSupabaseTime } from '@/utils';
import React from 'react';
import { CustomButton } from '../Common/CustomButton';
import { ActionIcon, Group } from '@mantine/core';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';
import { IconEdit, IconTrash } from '@tabler/icons';
import { ReturnHomeCareSupport } from '@/ducks/home-care-support/slice';

type Props = {
  handleDelete: (id: string) => Promise<void>;
  handlePDFDownload: (homeCare: ReturnHomeCareSupport) => Promise<void>;
};

export const HomeCareListRecords = ({
  handleDelete,
  handlePDFDownload,
}: Props) => {
  return [
    { accessor: 'year', title: '西暦', width: 110 },
    { accessor: 'month', title: '月', width: 110 },
    { accessor: 'name', title: '利用者名' },
    {
      accessor: 'created_at',
      title: '作成日時',
      width: 150,
      render: (homeCare: ReturnHomeCareSupport) =>
        homeCare.created_at ? convertSupabaseTime(homeCare.created_at) : '',
    },
    {
      accessor: 'updatedAt',
      title: '更新日時',
      width: 150,
      render: (homeCare: ReturnHomeCareSupport) =>
        homeCare.updated_at ? convertSupabaseTime(homeCare.updated_at) : '',
    },
    {
      accessor: 'download',
      title: 'ダウンロード',
      width: 150,
      render: (homeCare: ReturnHomeCareSupport) => (
        <CustomButton
          color="cyan"
          variant="light"
          onClick={() => handlePDFDownload(homeCare)}
        >
          ダウンロード
        </CustomButton>
      ),
    },
    {
      accessor: 'actions',
      title: 'アクション',
      width: 110,
      render: (homeCare: ReturnHomeCareSupport) => (
        <Group spacing={4} position="right" noWrap>
          <Link href={getPath('HOME_CARE_SUPPORT_EDIT', homeCare.id)}>
            <a>
              <ActionIcon color="blue">
                <IconEdit size={20} />
              </ActionIcon>
            </a>
          </Link>
          <ActionIcon color="red" onClick={() => handleDelete(homeCare.id)}>
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      ),
    },
  ];
};
