import { CustomButton } from '@/components/Common/CustomButton';
import { HomeCareSupportCreate } from '@/components/HomeCareSupport/HomeCareSupportCreate';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import React from 'react';

const HomeCareSupportCreatePage: NextPage = () => {
  return (
    <DashboardLayout title="記録票作成">
      <PageContainer title="実績記録票作成" fluid>
        <Space h="md" />
        <HomeCareSupportCreate />
      </PageContainer>
    </DashboardLayout>
  );
};

export default HomeCareSupportCreatePage;
