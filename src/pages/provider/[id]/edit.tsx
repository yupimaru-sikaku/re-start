import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ProviderCreate } from '@/components/Provider/ProviderCreate';
import { useAuth } from '@/hooks/auth/useAuth';

const ProviderEditPage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="事業所情報編集">
      <PageContainer title="事業所情報編集" fluid>
        <ProviderCreate type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default ProviderEditPage;
