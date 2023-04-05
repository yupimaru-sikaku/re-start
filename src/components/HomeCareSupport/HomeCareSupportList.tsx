import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { NextPage } from 'next';
import { convertSupabaseTime } from '@/utils';
import { ActionIcon, Box, Checkbox, Group, Text } from '@mantine/core';
import { IconCheckbox, IconEye, IconTrash } from '@tabler/icons';
import { IconEdit } from '@tabler/icons';
import { useRouter } from 'next/router';
import { ReturnHomeCareSupport } from '@/ducks/home-care-support/slice';
import { CustomButton } from '../Common/CustomButton';
import { CreatePdf } from './CreatePdf';
import { getPath } from '@/utils/const/getPath';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { CustomConfirm } from '../Common/CustomConfirm';
import { showNotification } from '@mantine/notifications';

type Props = {
  homeCareSupportList: ReturnHomeCareSupport[];
};

const PAGE_SIZE = 5;

export const HomeCareSupportList: NextPage<Props> = ({
  homeCareSupportList,
}) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(
    homeCareSupportList.slice(0, PAGE_SIZE)
  );

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(homeCareSupportList.slice(from, to));
  }, [page]);

  const handleShow = () => {};
  const handleEdit = (homeCare: ReturnHomeCareSupport) => {
    router.push(`${getPath('HOME_CARE_SUPPORT_EDIT', homeCare.id)}`);
  };
  const handleDelete = async (homeCare: ReturnHomeCareSupport) => {
    const isOK = await CustomConfirm('本当に削除しますか？', '確認画面');
    if (!isOK) return;
    const { error } = await supabase
      .from(getDb('HOME_CARE_RECORD'))
      .delete()
      .eq('id', homeCare.id);
    showNotification({
      icon: <IconCheckbox />,
      message: '削除しました。',
    });
    router.reload();
  };
  const handlePDFDownload = async (homeCare: ReturnHomeCareSupport) => {
    const pdfBytes = await CreatePdf('/home_care_records.pdf', homeCare);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${homeCare.name}.pdf`;
    link.click();
  };

  return (
    <DataTable
      sx={{ width: '1000px' }}
      verticalSpacing="lg"
      striped
      highlightOnHover
      withBorder
      records={records}
      recordsPerPage={PAGE_SIZE}
      totalRecords={homeCareSupportList.length}
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
          render: (homeCare) =>
            homeCare.created_at ? convertSupabaseTime(homeCare.created_at) : '',
        },
        {
          accessor: 'updatedAt',
          textAlignment: 'center',
          title: '更新日時',
          width: 150,
          render: (homeCare) =>
            homeCare.updated_at ? convertSupabaseTime(homeCare.updated_at) : '',
        },
        {
          accessor: 'download',
          title: 'ダウンロード',
          width: 150,
          render: (homeCare) => (
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
          render: (homeCare) => (
            <Group spacing={4} position="right" noWrap>
              <ActionIcon color="green" onClick={() => handleShow()}>
                <IconEye size={20} />
              </ActionIcon>
              <ActionIcon color="blue" onClick={() => handleEdit(homeCare)}>
                <IconEdit size={20} />
              </ActionIcon>
              <ActionIcon color="red" onClick={() => handleDelete(homeCare)}>
                <IconTrash size={20} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
    />
  );
};
