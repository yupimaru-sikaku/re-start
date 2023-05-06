import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffRegisterForm } from '@/components/Staff/StaffRegisterForm';
import React from 'react';

const StaffRegisterPage = () => {
  return (
    <DashboardLayout title="スタッフ情報登録">
      <PageContainer title="スタッフ情報登録" fluid>
        <StaffRegisterForm type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffRegisterPage;
