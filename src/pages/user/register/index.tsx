import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { UserRegisterForm } from '@/components/User/UserRegisterForm';
import { useAuth } from '@/hooks/auth/useAuth';

const UserRegisterPage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="利用者情報登録">
      <PageContainer title="利用者情報登録" fluid>
        <UserRegisterForm type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default UserRegisterPage;
