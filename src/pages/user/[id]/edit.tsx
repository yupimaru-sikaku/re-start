import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { UserRegisterForm } from '@/components/User/UserRegisterForm';
import React from 'react';

const UserEditPage = () => {
  return (
    <DashboardLayout title="利用者情報編集">
      <PageContainer title="情報編集" fluid>
        <UserRegisterForm type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default UserEditPage;
