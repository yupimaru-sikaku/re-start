import { ReturnProvider } from '@/ducks/provider/slice';
import { useSelector } from '@/ducks/store';
import { PAGE_SIZE, convertSupabaseTime } from '@/utils';
import { getPath } from '@/utils/const/getPath';
import { ActionIcon, Group } from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  loading: boolean;
  dataList?: ReturnProvider[];
};

export const TableProviderList = ({ loading, dataList }: Props) => {
  const [page, setPage] = useState(1);
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const from = useMemo(() => {
    return dataList ? (page - 1) * PAGE_SIZE : 0;
  }, [page, dataList]);
  const to = useMemo(() => {
    return dataList?.length ? from + PAGE_SIZE : 0;
  }, [from, dataList]);
  const originalRecordList = useMemo(() => {
    return dataList?.slice(from, to) || [];
  }, [from, to, dataList]);

  const [records, setRecords] = useState(originalRecordList);
  const [searchParamObj, setSearchParamObj] = useState({});

  useEffect(() => {
    let filteredRecords = originalRecordList;
    setRecords(filteredRecords);
  }, [searchParamObj, originalRecordList]);

  return (
    <DataTable
      noRecordsText="対象のデータがありません"
      sx={{ maxWidth: '900px' }}
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
        { accessor: 'corporate_name', title: '法人名', width: 200 },
        { accessor: 'office_name', title: '事業所名', width: 200 },
        { accessor: 'email', title: 'メールアドレス', width: 250 },
        {
          accessor: 'actions',
          title: 'アクション',
          width: 90,
          render: (provider: ReturnProvider) => (
            <Group spacing={4} position="center" noWrap>
              <ActionIcon color="blue">
                <Link href={getPath('PROVIDER_EDIT', provider.id)}>
                  <IconEdit size={20} />
                </Link>
              </ActionIcon>
            </Group>
          ),
        },
        {
          accessor: 'updatedAt',
          title: '更新日時',
          width: 150,
          render: (provider: ReturnProvider) => (provider.updated_at ? convertSupabaseTime(provider.updated_at) : ''),
        },
      ]}
    />
  );
};
