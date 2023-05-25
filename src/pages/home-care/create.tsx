import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { HomeCareCreate } from '@/components/HomeCare/HomeCareCreate';
import { useAuth } from '@/hooks/auth/useAuth';

const HomeCareCreatePage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="実績記録票作成（居宅介護）">
      <PageContainer title="実績記録票作成（居宅介護）" fluid>
        <HomeCareCreate type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default HomeCareCreatePage;
