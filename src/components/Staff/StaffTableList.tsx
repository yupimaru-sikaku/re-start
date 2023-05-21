import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Checkbox, Group, SimpleGrid, Space, TextInput } from '@mantine/core';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';
import { IconEdit } from '@tabler/icons';
import { convertSupabaseTime } from '@/utils';
import { DataTable } from 'mantine-datatable';
import { ReturnStaff } from '@/ducks/staff/slice';

type Props = {
  loading: boolean;
  dataList?: ReturnStaff[];
};

export const StaffTableList = ({ loading, dataList }: Props) => {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const from = useMemo(() => {
    return dataList ? (page - 1) * PAGE_SIZE : 0;
  }, [page, dataList]);
  const to = useMemo(() => {
    return dataList?.length ? from + PAGE_SIZE : 0;
  }, [from]);
  const originalRecordList = useMemo(() => {
    return dataList?.slice(from, to) || [];
  }, [from]);

  const [records, setRecords] = useState(originalRecordList);
  const [searchParamObj, setSearchParamObj] = useState({ name: '' });

  const handleChangeSearchObj = useCallback((e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof searchParamObj) => {
    setSearchParamObj((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  }, []);

  useEffect(() => {
    let filteredRecords = originalRecordList;
    filteredRecords = filteredRecords.filter((record) => record.name.includes(searchParamObj.name));
    setRecords(filteredRecords);
  }, [searchParamObj, originalRecordList]);

  return (
    <>
      <SimpleGrid
        breakpoints={[
          { minWidth: 'sm', cols: 2 },
          { minWidth: 'md', cols: 6 },
          { minWidth: 'xl', cols: 8 },
        ]}
      >
        <TextInput label="スタッフ名" value={searchParamObj.name} onChange={(e) => handleChangeSearchObj(e, 'name')} />
      </SimpleGrid>
      <Space h="lg" />
      <DataTable
        noRecordsText="対象のデータがありません"
        sx={{ maxWidth: '980px' }}
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
          { accessor: 'name', title: '名前', width: 110 },
          { accessor: 'gender', title: '性別', width: 50 },
          {
            accessor: 'work_time_per_week',
            title: '勤務時間/週',
            width: 100,
          },
          {
            accessor: 'syoninsya',
            width: 70,
            title: '初任者',
            render: (staff: ReturnStaff) => (
              <Group position="center">
                <Checkbox readOnly checked={staff.is_syoninsya} />
              </Group>
            ),
          },
          {
            accessor: 'kodo',
            width: 80,
            title: '行動援護',
            render: (staff: ReturnStaff) => (
              <Group position="center">
                <Checkbox readOnly checked={staff.is_kodo} />
              </Group>
            ),
          },
          {
            accessor: 'doko_normal',
            width: 80,
            title: '同行一般',
            render: (staff: ReturnStaff) => (
              <Group position="center">
                <Checkbox readOnly checked={staff.is_doko_normal} />
              </Group>
            ),
          },
          {
            accessor: 'doko_apply',
            width: 80,
            title: '同行応用',
            render: (staff: ReturnStaff) => (
              <Group position="center">
                <Checkbox readOnly checked={staff.is_doko_apply} />
              </Group>
            ),
          },
          {
            accessor: 'zitsumusya',
            width: 70,
            title: '実務者',
            render: (staff: ReturnStaff) => (
              <Group position="center">
                <Checkbox readOnly checked={staff.is_zitsumusya} />
              </Group>
            ),
          },
          {
            accessor: 'kaigo',
            width: 90,
            title: '介護福祉士',
            render: (staff: ReturnStaff) => (
              <Group position="center">
                <Checkbox readOnly checked={staff.is_kaigo} />
              </Group>
            ),
          },
          {
            accessor: 'actions',
            title: 'アクション',
            width: 90,
            render: (staff: ReturnStaff) => (
              <Group spacing={4} position="center" noWrap>
                <Link href={getPath('STAFF_EDIT', staff.id)}>
                  <a>
                    <ActionIcon color="blue">
                      <IconEdit size={20} />
                    </ActionIcon>
                  </a>
                </Link>
              </Group>
            ),
          },
          {
            accessor: 'updatedAt',
            title: '更新日時',
            width: 150,
            render: (staff: ReturnStaff) => convertSupabaseTime(staff.updated_at),
          },
        ]}
      />
    </>
  );
};
