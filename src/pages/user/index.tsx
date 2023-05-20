import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { CustomButton } from '@/components/Common/CustomButton';
import { UserList } from '@/components/User/UserList';
import { getPath } from '@/utils/const/getPath';
import { useAuth } from '@/hooks/auth/useAuth';
import { Space } from '@mantine/core';

const UserPage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="利用者情報">
      <PageContainer title="利用者情報" fluid>
        <Link href={getPath('USER_REGISTER')}>
          <a>
            <CustomButton>利用者情報登録</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <UserList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default UserPage;
