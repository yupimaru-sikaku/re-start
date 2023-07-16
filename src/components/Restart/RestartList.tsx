import React, { useEffect, useState } from 'react';
import { supabase } from '@/libs/supabase/supabase';
import { DataTable } from 'mantine-datatable';
import { ActionIcon, Button, Group } from '@mantine/core';
import Link from 'next/link';
import { IconEdit, IconEye } from '@tabler/icons';
import { CreatePdf } from './CreatePdf';

export const RestartList = () => {
  const [page, setPage] = useState(1);
  const [restartList, setRestartList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const { data } = (await supabase.from('restart').select('*')) as any;
    setRestartList(data);
  };

  const handlePDFDownload = async (service: any) => {
    const pdfBytes = await CreatePdf('/recordList/v1/zishi_record.pdf', service);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${service.year}年${service.month}月_${service.user_name}.pdf`;
    link.click();
  };

  return (
    <DataTable
      noRecordsText="対象のデータがありません"
      striped
      highlightOnHover
      withBorder
      records={restartList}
      recordsPerPage={10}
      totalRecords={restartList?.length || 0}
      page={1}
      onPageChange={(p) => setPage(p)}
      columns={[
        { accessor: 'year', title: '西暦', width: 60 },
        { accessor: 'month', title: '月', width: 50 },
        { accessor: 'user_name', title: '利用者名', width: 150 },
        { accessor: 'staff_name', title: 'スタッフ名', width: 150 },
        {
          accessor: 'actions',
          title: '',
          width: 90,
          render: (service: any) => (
            <Group spacing={4} position="center" noWrap>
              <Link href={`/restart/${service.id}/`}>
                <a>
                  <Button color="cyan">詳細</Button>
                </a>
              </Link>
            </Group>
          ),
        },
        // {
        //   accessor: 'download',
        //   title: 'ダウンロード',
        //   width: 250,
        //   render: (service: any) => (
        //     <Button color="cyan" onClick={() => handlePDFDownload(service)}>
        //       ダウンロード
        //     </Button>
        //   ),
        // },
      ]}
    />
  );
};
