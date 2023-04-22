import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffList } from '@/components/Staff/StaffList';
import { ReturnStaff } from '@/ducks/staff/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Box, Group, Space } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';

type Props = {
  staffList: ReturnStaff[];
};

const StaffPersonalSchedulePage: NextPage<Props> = ({ staffList }) => {
  const router = useRouter();
  const moveToRegister = useCallback(() => {
    router.push(getPath('STAFF_REGISTER'));
  }, []);
  const moveToSchedule = useCallback(() => {
    router.push(getPath('STAFF_SCHEDULE'));
  }, []);

  return (
    <DashboardLayout title="勤怠状況">
      <PageContainer title="勤怠状況" fluid>
        <Space h="md" />
        <Group>
          <CustomButton onClick={moveToRegister}>スタッフ情報登録</CustomButton>
          <CustomButton onClick={moveToSchedule}>勤務状況</CustomButton>
        </Group>
        <Space h="md" />
        <StaffList staffList={staffList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const { data, error } = await supabase.from(getDb('STAFF')).select('id');

  if (error || !data) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const paths = data.map((record) => ({
    params: { id: record.id.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async () => {
  const { data: staffList } = await supabase
    .from(getDb('STAFF'))
    .select('*')
    .order('updated_at', { ascending: false });
  return {
    props: {
      staffList,
    },
  };
};

export default StaffPersonalSchedulePage;
