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
import Link from 'next/link';
import { useGetTablePage } from '@/hooks/useGetTablePage';
import { ReturnAccompany } from '@/ducks/accompany/slice';

type Props = {
  accompanyList: ReturnAccompany[];
};

export const AccompanyList: NextPage<Props> = ({ accompanyList }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { records, PAGE_SIZE } = useGetTablePage(page, accompanyList);

  const handleShow = () => {};
  const handleDelete = async (accompany: ReturnAccompany) => {
    const isOK = await CustomConfirm(
      '本当に削除しますか？',
      '確認画面'
    );
    if (!isOK) return;
    const { error } = await supabase
      .from(getDb('Accompany'))
      .delete()
      .eq('id', accompany.id);
    showNotification({
      icon: <IconCheckbox />,
      message: '削除しました。',
    });
    router.reload();
  };
  const handlePDFDownload = async (accompany: ReturnAccompany) => {
    // const pdfBytes = await CreatePdf('/home_care_records.pdf', accompany);
    // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = `${accompany.name}.pdf`;
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
      totalRecords={AccompanyList.length}
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
          render: (accompany) =>
            accompany.created_at
              ? convertSupabaseTime(accompany.created_at)
              : '',
        },
        {
          accessor: 'updatedAt',
          textAlignment: 'center',
          title: '更新日時',
          width: 150,
          render: (accompany) =>
            accompany.updated_at
              ? convertSupabaseTime(accompany.updated_at)
              : '',
        },
        {
          accessor: 'download',
          title: 'ダウンロード',
          width: 150,
          render: (accompany) => (
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
          width: 110,
          render: (accompany) => (
            <Group spacing={4} position="right" noWrap>
              <ActionIcon color="green" onClick={() => handleShow()}>
                <IconEye size={20} />
              </ActionIcon>
              <Link href={getPath('Accompany_EDIT', accompany.id)}>
                <a>
                  <ActionIcon color="blue">
                    <IconEdit size={20} />
                  </ActionIcon>
                </a>
              </Link>
              <ActionIcon
                color="red"
                onClick={() => handleDelete(accompany)}
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
