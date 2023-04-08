import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffList } from '@/components/Staff/StaffList';
import { ReturnStaff } from '@/ducks/staff/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

type Props = {
  staffList: ReturnStaff[];
};

const StaffPage: NextPage<Props> = ({ staffList }) => {
  const router = useRouter();
  const moveToRegister = useCallback(() => {
    router.push(getPath('STAFF_REGISTER'));
  }, []);

  return (
    <DashboardLayout title="スタッフ情報">
      <PageContainer title="スタッフ情報" fluid>
        <Space h="md" />
        <CustomButton onClick={moveToRegister}>スタッフ情報登録</CustomButton>
        <Space h="md" />
        <StaffList staffList={staffList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffPage;

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
