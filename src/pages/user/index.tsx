import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { UserList } from '@/components/User/UserList';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

const UserPage: NextPage = () => {
  return (
    <DashboardLayout title="利用者情報">
      <PageContainer title="利用者情報" fluid>
        <Space h="md" />
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
