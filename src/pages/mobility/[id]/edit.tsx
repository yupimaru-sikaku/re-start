import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { MobilityCreate } from '@/components/Mobility/MobilityCreate';
import { PageContainer } from '@/components/PageContainer';
import { Space } from '@mantine/core';
import React from 'react';

const MobilityEditPage = () => {
  return (
    <DashboardLayout title="記録票編集">
      <PageContainer title="実績記録票編集" fluid>
        <Space h="md" />
        <MobilityCreate type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default MobilityEditPage;
