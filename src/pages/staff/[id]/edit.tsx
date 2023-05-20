import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffRegisterForm } from '@/components/Staff/StaffRegisterForm';
import { useAuth } from '@/hooks/auth/useAuth';

const StaffEditPage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="スタッフ情報編集">
      <PageContainer title="情報編集" fluid>
        <StaffRegisterForm type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffEditPage;
