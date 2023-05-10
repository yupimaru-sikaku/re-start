import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { BehaviorCreate } from '@/components/Behavior/BehaviorCreate';
import { useAuth } from '@/hooks/auth/useAuth';

const BehaviorCreatePage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="記録票作成（行動援護）">
      <PageContainer title="実績記録票作成（行動援護）" fluid>
        <BehaviorCreate type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default BehaviorCreatePage;
