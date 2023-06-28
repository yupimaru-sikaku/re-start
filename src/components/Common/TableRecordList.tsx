import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Group, Radio, Select, SimpleGrid, Space, Text, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATH, getPath } from '@/utils/const/getPath';
import { IconEdit } from '@tabler/icons';
import { PAGE_SIZE, convertSupabaseTime, monthList, yearList } from '@/utils';
import { DataTable } from 'mantine-datatable';
import { OptionButton } from '@/components/Common/OptionButton';
import { CustomConfirm } from '@/components/Common/CustomConfirm';
import { CreatePdf } from '@/components/Accompany/CreatePdf';
import { RecordServiceType, UpdateRecordType } from '@/ducks/common-service/slice';

type Props = {
  path: keyof typeof PATH;
  loading: boolean;
  dataList?: any;
  updateRecord: UpdateRecordType;
};

export const TableRecordList = ({ path, loading, dataList, updateRecord }: Props) => {
  const currentDate = new Date();
  const [page, setPage] = useState(1);
  const recordPath = useMemo(() => {
    const defaultPath = '/recordList';
    switch (path) {
      case 'ACCOMPANY_EDIT':
        return `${defaultPath}/v1/doko_record.pdf`;
      case 'BEHAVIOR_EDIT':
        return `${defaultPath}/v1/kodo_record.pdf`;
      case 'MOBILITY_EDIT':
        return `${defaultPath}/v1/ido_record.pdf`;
      case 'HOME_CARE_EDIT':
        return `${defaultPath}/v1/kyotaku_record.pdf`;
      default:
        return '';
    }
  }, [path]);

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
      (record: any) =>
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

  const handleChangeStatus = async (service: RecordServiceType, statusId: number) => {
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

  const handlePDFDownload = async (service: RecordServiceType) => {
    const pdfBytes = await CreatePdf(recordPath, service);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${service.year}年${service.month}月_${service.user_name}.pdf`;
    link.click();
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
            render: (service: RecordServiceType) => <Text>{getStatusText(service.status)}</Text>,
          },
          {
            accessor: 'download',
            title: 'アクション',
            width: 250,
            render: (service: RecordServiceType) => (
              <OptionButton service={service} handleChangeStatus={handleChangeStatus} handlePDFDownload={handlePDFDownload} />
            ),
          },
          {
            accessor: 'actions',
            title: '',
            width: 90,
            render: (service: RecordServiceType) => (
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
            render: (service: RecordServiceType) => (service.updated_at ? convertSupabaseTime(service.updated_at) : ''),
          },
        ]}
      />
    </>
  );
};
