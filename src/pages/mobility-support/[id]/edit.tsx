import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { BehaviorCreate } from '@/components/Behavior/BehaviorCreate';
import { PageContainer } from '@/components/PageContainer';
import { Space } from '@mantine/core';
import React from 'react';

const BehaviorEditPage = () => {
  return (
    <DashboardLayout title="記録票編集">
      <PageContainer title="実績記録票編集" fluid>
        <Space h="md" />
        <BehaviorCreate type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default BehaviorEditPage;
