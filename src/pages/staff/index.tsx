import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffList } from '@/components/Staff/StaffList';
import { getPath } from '@/utils/const/getPath';
import { Group, Space } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

const StaffPage: NextPage = () => {
  const router = useRouter();
  const moveToRegister = useCallback(() => {
    router.push(getPath('STAFF_REGISTER'));
  }, []);

  return (
    <DashboardLayout title="スタッフ情報">
      <PageContainer title="スタッフ情報" fluid>
        <Space h="md" />
        <Group>
          <CustomButton onClick={moveToRegister}>スタッフ情報登録</CustomButton>
        </Group>
        <Space h="md" />
        <StaffList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffPage;
