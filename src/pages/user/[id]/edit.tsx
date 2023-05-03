import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { UserEditForm } from '@/components/User/UserEditForm';
import React from 'react';

const UserEditPage = () => {
  return (
    <DashboardLayout title="利用者情報編集">
      <PageContainer title="情報編集" fluid>
        <UserEditForm />
      </PageContainer>
    </DashboardLayout>
  );
};

export default UserEditPage;
