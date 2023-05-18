import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { CustomButton } from '@/components/Common/CustomButton';
import { StaffList } from '@/components/Staff/StaffList';
import { getPath } from '@/utils/const/getPath';
import { useAuth } from '@/hooks/auth/useAuth';
import { Space } from '@mantine/core';

const StaffPage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="スタッフ情報">
      <PageContainer title="スタッフ情報" fluid>
        <Link href={getPath('STAFF_REGISTER')}>
          <a>
            <CustomButton>スタッフ情報登録</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <StaffList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffPage;
