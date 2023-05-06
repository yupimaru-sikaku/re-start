import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffRegisterForm } from '@/components/Staff/StaffRegisterForm';
import React from 'react';

const StaffEditPage = () => {
  return (
    <DashboardLayout title="スタッフ情報編集">
      <PageContainer title="情報編集" fluid>
        <StaffRegisterForm type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffEditPage;
