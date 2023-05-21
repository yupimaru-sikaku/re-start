import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import ScheduleList from '@/components/Schedule/ScheduleList';
import { useAuth } from '@/hooks/auth/useAuth';

const SchedulePage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="シフト管理">
      <PageContainer title="シフト管理" fluid>
        <ScheduleList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default SchedulePage;
