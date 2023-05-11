import React, { useState } from 'react';
import { CustomButton } from './CustomButton';
import { ActionIcon, Group } from '@mantine/core';
import Link from 'next/link';
import { PATH, getPath } from '@/utils/const/getPath';
import { IconEdit, IconTrash } from '@tabler/icons';
import { convertSupabaseTime } from '@/utils';
import { CustomConfirm } from './CustomConfirm';
import { DataTable } from 'mantine-datatable';
import { useGetTablePage } from '@/hooks/table/useGetTablePage';

type Props = {
  deleteAction: any;
  refetch: any;
  path: keyof typeof PATH;
  loading: boolean;
  dataList: any;
};

export const TableList = ({
  deleteAction,
  refetch,
  path,
  loading,
  dataList,
}: Props) => {
  const [page, setPage] = useState(1);
  const { records, PAGE_SIZE } = useGetTablePage(page, dataList);

  const handlePDFDownload = async () => {
    // const pdfBytes = await CreatePdf(
    //   '/home_care_records.pdf',
    //   Mobility
    // );
    // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = `${Mobility.name}.pdf`;
    // link.click();
  };

  const handleDelete = async (id: string) => {
    const isOK = await CustomConfirm('本当に削除しますか？', '確認画面');
    if (!isOK) return;
    try {
      const { error } = await deleteAction(id);
      if (error) {
        throw new Error(`記録票の削除に失敗しました。${error.message}`);
      }
      refetch();
    } catch (error: any) {
      await CustomConfirm(error.message, 'Caution');
      return;
    }
  };

  return (
    <DataTable
      sx={{ maxWidth: '650px' }}
      fetching={loading}
      striped
      highlightOnHover
      withBorder
      records={records}
      recordsPerPage={PAGE_SIZE}
      totalRecords={dataList?.length || 0}
      page={page}
      onPageChange={(p) => setPage(p)}
      columns={[
        { accessor: 'year', title: '西暦', width: 60 },
        { accessor: 'month', title: '月', width: 50 },
        { accessor: 'name', title: '利用者名', width: 150 },
        {
          accessor: 'download',
          title: 'ダウンロード',
          width: 130,
          render: (service: any) => (
            <CustomButton
              color="cyan"
              variant="light"
              onClick={() => handlePDFDownload()}
            >
              ダウンロード
            </CustomButton>
          ),
        },
        {
          accessor: 'actions',
          title: 'アクション',
          width: 90,
          render: (service: any) => (
            <Group spacing={4} position="right" noWrap>
              <Link href={getPath(path, service.id)}>
                <a>
                  <ActionIcon color="blue">
                    <IconEdit size={20} />
                  </ActionIcon>
                </a>
              </Link>
              <ActionIcon color="red" onClick={() => handleDelete(service.id)}>
                <IconTrash size={20} />
              </ActionIcon>
            </Group>
          ),
        },
        {
          accessor: 'updatedAt',
          title: '更新日時',
          width: 150,
          render: (service: any) =>
            service.updated_at ? convertSupabaseTime(service.updated_at) : '',
        },
      ]}
    />
  );
};
