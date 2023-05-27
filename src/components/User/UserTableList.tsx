import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Checkbox, Group, SimpleGrid, Space, TextInput } from '@mantine/core';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';
import { IconEdit } from '@tabler/icons';
import { KAZI, PAGE_SIZE, SHINTAI, TSUIN, WITH_TSUIN, convertSupabaseTime } from '@/utils';
import { DataTable } from 'mantine-datatable';
import { ReturnUser } from '@/ducks/user/slice';
import { useSelector } from '@/ducks/store';

type Props = {
  loading: boolean;
};

export const UserTableList = ({ loading }: Props) => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const userList = useSelector((state) => state.user.userList);
  const selectedUserList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return userList;
      case 'corporate':
        return userList.filter((user) => user.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return userList.filter((user) => user.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [userList, loginProviderInfo]);
  const [page, setPage] = useState(1);
  const from = useMemo(() => {
    return selectedUserList ? (page - 1) * PAGE_SIZE : 0;
  }, [page, selectedUserList]);
  const to = useMemo(() => {
    return selectedUserList?.length ? from + PAGE_SIZE : 0;
  }, [from, selectedUserList]);
  const originalRecordList = useMemo(() => {
    return selectedUserList?.slice(from, to) || [];
  }, [from, to, selectedUserList]);

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
        <TextInput label="利用者名" value={searchParamObj.name} onChange={(e) => handleChangeSearchObj(e, 'name')} />
      </SimpleGrid>
      <Space h="lg" />
      <DataTable
        noRecordsText="対象のデータがありません"
        sx={{ maxWidth: '1170px' }}
        fetching={loading}
        striped
        highlightOnHover
        withBorder
        records={records}
        recordsPerPage={PAGE_SIZE}
        totalRecords={selectedUserList?.length || 0}
        page={page}
        onPageChange={(p) => setPage(p)}
        columns={[
          { accessor: 'name', title: '名前', width: 110 },
          { accessor: 'gender', title: '性別', width: 50 },
          {
            accessor: 'gender_specification',
            title: '性別指定',
            width: 80,
          },
          {
            accessor: 'ido',
            width: 80,
            title: '移動支援',
            render: (user: ReturnUser) => (
              <Group position="center">
                <Checkbox readOnly checked={user.is_ido} />
              </Group>
            ),
          },
          {
            accessor: 'kodo',
            width: 80,
            title: '行動援護',
            render: (user: ReturnUser) => (
              <Group position="center">
                <Checkbox readOnly checked={user.is_kodo} />
              </Group>
            ),
          },
          {
            accessor: 'doko',
            width: 80,
            title: '同行援護',
            render: (user: ReturnUser) => (
              <Group position="center">
                <Checkbox readOnly checked={user.is_doko} />
              </Group>
            ),
          },
          {
            accessor: 'kazi',
            width: 80,
            title: KAZI,
            render: (user: ReturnUser) => (
              <Group position="center">
                <Checkbox readOnly checked={user.is_kazi} />
              </Group>
            ),
          },
          {
            accessor: 'shintai',
            width: 80,
            title: SHINTAI,
            render: (user: ReturnUser) => (
              <Group position="center">
                <Checkbox readOnly checked={user.is_shintai} />
              </Group>
            ),
          },
          {
            accessor: 'with_tsuin',
            width: 150,
            title: WITH_TSUIN,
            render: (user: ReturnUser) => (
              <Group position="center">
                <Checkbox readOnly checked={user.is_with_tsuin} />
              </Group>
            ),
          },
          {
            accessor: 'tsuin',
            width: 180,
            title: TSUIN,
            render: (user: ReturnUser) => (
              <Group position="center">
                <Checkbox readOnly checked={user.is_tsuin} />
              </Group>
            ),
          },
          {
            accessor: 'city',
            width: 80,
            title: '市区町村',
          },
          {
            accessor: 'disability_type',
            width: 80,
            title: '障害種別',
          },
          {
            accessor: 'actions',
            title: 'アクション',
            width: 90,
            render: (staff: ReturnUser) => (
              <Group spacing={4} position="center" noWrap>
                <Link href={getPath('USER_EDIT', staff.id)}>
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
            render: (user: ReturnUser) => (user.updated_at ? convertSupabaseTime(user.updated_at) : ''),
          },
        ]}
      />
    </>
  );
};
