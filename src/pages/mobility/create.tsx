import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { MobilityCreate } from '@/components/Mobility/MobilityCreate';
import { useAuth } from '@/hooks/auth/useAuth';

const MobilityCreatePage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="記録票作成（移動支援）">
      <PageContainer title="実績記録票作成（移動支援）" fluid>
        <MobilityCreate type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default MobilityCreatePage;
