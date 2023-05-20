import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffRegisterForm } from '@/components/Staff/StaffRegisterForm';
import { useAuth } from '@/hooks/auth/useAuth';

const StaffRegisterPage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="スタッフ情報登録">
      <PageContainer title="スタッフ情報登録" fluid>
        <StaffRegisterForm type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffRegisterPage;
