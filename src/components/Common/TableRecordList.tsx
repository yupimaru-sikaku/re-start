import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Group, Radio, Select, SimpleGrid, Space, Text, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATH, getPath } from '@/utils/const/getPath';
import { IconEdit } from '@tabler/icons';
import { convertSupabaseTime, monthList, yearList } from '@/utils';
import { DataTable } from 'mantine-datatable';
import { ReturnAccompany } from '@/ducks/accompany/slice';
import { ReturnMobility } from '@/ducks/mobility/slice';
import { ReturnBehavior } from '@/ducks/behavior/slice';
import { OptionButton } from './OptionButton';
import { CustomConfirm } from './CustomConfirm';

type Props = {
  path: keyof typeof PATH;
  loading: boolean;
  dataList?: ReturnAccompany[] | ReturnBehavior[] | ReturnMobility[];
  updateRecord: any;
};

type ServiceType = ReturnAccompany | ReturnMobility | ReturnBehavior;

export const TableRecordList = ({ path, loading, dataList, updateRecord }: Props) => {
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
    userName: '',
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
        record.user_name.includes(searchParamObj.userName)
    );
    setRecords(filteredRecords);
  }, [dataList, searchParamObj, originalRecordList]);

  const getStatusText = (statusId: number) => {
    switch (statusId) {
      case 0:
        return '作成中';
      case 1:
        return '確認中';
      case 2:
        return '申請中';
      case 3:
        return '申請完了';
      default:
        return '';
    }
  };

  const handleChangeStatus = async (service: ServiceType, statusId: number) => {
    let confirmMessage = '';
    if (statusId === 0) {
      confirmMessage = 'この記録票を差戻ししますか？';
    } else if (statusId === 1) {
      confirmMessage = 'この記録票を提出しますか？修正は依頼がある場合のみできます。';
    } else if (statusId === 2) {
      confirmMessage = 'この記録票を申請しますか？';
    } else if (statusId === 3) {
      confirmMessage = 'この記録票を完了にしますか？';
    }
    const isOk = await CustomConfirm(confirmMessage, '確認画面');
    if (!isOk) return;
    const updateParams = {
      ...service,
      status: statusId,
    };
    const { error } = await updateRecord(updateParams);
    if (error) await CustomConfirm('記録表の更新に失敗しました', 'Caution');
  };

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
          label="利用者名"
          value={searchParamObj.userName}
          onChange={(e) => handleChangeSearchObj(e.target.value, 'userName')}
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
        // sx={{ maxWidth: '650px' }}
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
          { accessor: 'user_name', title: '利用者名', width: 150 },
          {
            accessor: 'progress',
            title: '申請状況',
            width: 100,
            render: (service: ServiceType) => <Text>{getStatusText(service.status)}</Text>,
          },
          {
            accessor: 'download',
            title: 'アクション',
            width: 500,
            render: (service: ServiceType) => <OptionButton service={service} handleChangeStatus={handleChangeStatus} />,
          },
          {
            accessor: 'actions',
            title: '',
            width: 90,
            render: (service: ServiceType) => (
              <Group spacing={4} position="center" noWrap>
                <Link href={getPath(path, service.id)}>
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
            render: (service: ServiceType) => (service.updated_at ? convertSupabaseTime(service.updated_at) : ''),
          },
        ]}
      />
    </>
  );
};
