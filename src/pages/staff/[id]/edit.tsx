import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffEditForm } from '@/components/Staff/StaffEditForm';
import { Space } from '@mantine/core';
import React from 'react';

const StaffEditPage = () => {
  return (
    <DashboardLayout title="スタッフ情報編集">
      <PageContainer title="情報編集" fluid>
        <Space h="md" />
        <StaffEditForm />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffEditPage;
