import { ReturnAccompanyingSupport } from '@/ducks/accompanying-support/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { convertSupabaseTime, PAGE_SIZE } from '@/utils';
import { getPath } from '@/utils/const/getPath';
import { ActionIcon, Group } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CustomButton } from '../Common/CustomButton';
import { CustomConfirm } from '../Common/CustomConfirm';
import { IconCheckbox, IconEye, IconTrash } from '@tabler/icons';
import { IconEdit } from '@tabler/icons';
import { CreatePdf } from './CreatePdf';
import Link from 'next/link';
import { useGetTablePage } from '@/hooks/useGetTablePage';

type Props = {
  accompanyingSupportList: ReturnAccompanyingSupport[];
};

export const AccompanyingSupportList: NextPage<Props> = ({
  accompanyingSupportList,
}) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { records, PAGE_SIZE } = useGetTablePage(page, accompanyingSupportList);

  const handleShow = () => {};
  const handleDelete = async (accompanying: ReturnAccompanyingSupport) => {
    const isOK = await CustomConfirm('本当に削除しますか？', '確認画面');
    if (!isOK) return;
    const { error } = await supabase
      .from(getDb('ACCOMPANYING'))
      .delete()
      .eq('id', accompanying.id);
    showNotification({
      icon: <IconCheckbox />,
      message: '削除しました。',
    });
    router.reload();
  };
  const handlePDFDownload = async (accompanying: ReturnAccompanyingSupport) => {
    // const pdfBytes = await CreatePdf('/home_care_records.pdf', accompanying);
    // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = `${accompanying.name}.pdf`;
    // link.click();
  };
  return (
    <DataTable
      verticalSpacing="lg"
      striped
      highlightOnHover
      withBorder
      records={records}
      recordsPerPage={PAGE_SIZE}
      totalRecords={accompanyingSupportList.length}
      page={page}
      loaderVariant="oval"
      loaderSize="lg"
      loaderBackgroundBlur={1}
      onPageChange={(p) => setPage(p)}
      columns={[
        { accessor: 'year', title: '西暦', width: 110 },
        { accessor: 'month', title: '月', width: 110 },
        { accessor: 'name', title: '利用者名' },
        {
          accessor: 'created_at',
          textAlignment: 'center',
          title: '作成日時',
          width: 150,
          render: (accompanying) =>
            accompanying.created_at
              ? convertSupabaseTime(accompanying.created_at)
              : '',
        },
        {
          accessor: 'updatedAt',
          textAlignment: 'center',
          title: '更新日時',
          width: 150,
          render: (accompanying) =>
            accompanying.updated_at
              ? convertSupabaseTime(accompanying.updated_at)
              : '',
        },
        {
          accessor: 'download',
          title: 'ダウンロード',
          width: 150,
          render: (accompanying) => (
            <CustomButton
              color="cyan"
              variant="light"
              onClick={() => handlePDFDownload(accompanying)}
            >
              ダウンロード
            </CustomButton>
          ),
        },
        {
          accessor: 'actions',
          title: 'アクション',
          width: 110,
          render: (accompanying) => (
            <Group spacing={4} position="right" noWrap>
              <ActionIcon color="green" onClick={() => handleShow()}>
                <IconEye size={20} />
              </ActionIcon>
              <Link
                href={getPath('ACCOMPANYING_SUPPPORT_EDIT', accompanying.id)}
              >
                <a>
                  <ActionIcon color="blue">
                    <IconEdit size={20} />
                  </ActionIcon>
                </a>
              </Link>
              <ActionIcon
                color="red"
                onClick={() => handleDelete(accompanying)}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
    />
  );
};
