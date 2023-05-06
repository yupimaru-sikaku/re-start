import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { MobilityCreate } from '@/components/Mobility/MobilityCreate';
import { PageContainer } from '@/components/PageContainer';
import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';

const MobilityCreatePage = () => {
  useAuth();
  return (
    <DashboardLayout title="記録票作成">
      <PageContainer title="実績記録票作成" fluid>
        <MobilityCreate type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default MobilityCreatePage;
