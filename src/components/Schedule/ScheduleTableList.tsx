import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ActionIcon, Group, Radio, Select, SimpleGrid, Space, TextInput } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconEye } from '@tabler/icons';
import { ReturnSchedule } from '@/ducks/schedule/slice';
import { convertSupabaseTime, monthList, yearList } from '@/utils';
import { getPath } from '@/utils/const/getPath';

type Props = {
  loading: boolean;
  dataList?: ReturnSchedule[];
};

const ScheduleTableList = ({ loading, dataList }: Props) => {
  const PAGE_SIZE = 10;
  const currentDate = new Date();
  const [page, setPage] = useState(1);
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
  const [searchParamObj, setSearchParamObj] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    staffName: '',
  });

  const handleChangeSearchObj = useCallback((value: string, field: keyof typeof searchParamObj) => {
    setSearchParamObj((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    let filteredRecords = originalRecordList;
    filteredRecords = filteredRecords.filter(
      (record) =>
        record.year.toString().includes(searchParamObj.year.toString()) &&
        record.month.toString().includes(searchParamObj.month.toString()) &&
        record.staff_name.includes(searchParamObj.staffName)
    );
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
        <TextInput
          label="スタッフ名"
          value={searchParamObj.staffName}
          onChange={(e) => handleChangeSearchObj(e.target.value, 'staffName')}
        />
        <Select
          label="西暦"
          data={yearList}
          defaultValue={searchParamObj.year.toString()}
          onChange={(value) => handleChangeSearchObj(value!, 'year')}
        />
      </SimpleGrid>
      <Space h="md" />
      <Radio.Group
        name="month"
        onChange={(value) => handleChangeSearchObj(value, 'month')}
        value={searchParamObj.month.toString()}
      >
        {monthList.map((month) => (
          <Radio key={month} value={month.toString()} label={`${month}月`} />
        ))}
      </Radio.Group>
      <Space h="lg" />
      <DataTable
        noRecordsText="対象のデータがありません"
        sx={{ maxWidth: '470px' }}
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
          { accessor: 'staff_name', title: 'スタッフ名', width: 110 },
          {
            accessor: 'actions',
            title: 'アクション',
            width: 90,
            render: (schedule: ReturnSchedule) => (
              <Group spacing={4} position="center" noWrap>
                <Link href={getPath('SCHEDULE_DETAIL', schedule.id)}>
                  <a>
                    <ActionIcon color="green">
                      <IconEye size={20} />
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
            render: (schedule: ReturnSchedule) => convertSupabaseTime(schedule.updated_at),
          },
        ]}
      />
    </>
  );
};

export default ScheduleTableList;
