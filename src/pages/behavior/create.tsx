import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { BehaviorCreate } from '@/components/Behavior/BehaviorCreate';
import { PageContainer } from '@/components/PageContainer';
import { Space } from '@mantine/core';
import React from 'react';

const BehaviorCreatePage = () => {
  return (
    <DashboardLayout title="記録票作成">
      <PageContainer title="実績記録票作成" fluid>
        <BehaviorCreate type="create" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default BehaviorCreatePage;
