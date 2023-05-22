import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { AccompanyCreate } from '@/components/Accompany/AccompanyCreate';
import { useAuth } from '@/hooks/auth/useAuth';

const AccompanyCreatePage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="実績記録票作成（同行援護）">
      <PageContainer title="実績記録票作成（同行援護）" fluid>
        <AccompanyCreate type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default AccompanyCreatePage;
