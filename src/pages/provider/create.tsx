import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ProviderCreate } from '@/components/Provider/ProviderCreate';
import { useAuth } from '@/hooks/auth/useAuth';

const ProviderCreatePage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="事業所情報登録">
      <PageContainer title="事業所情報登録" fluid>
        <ProviderCreate type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default ProviderCreatePage;
