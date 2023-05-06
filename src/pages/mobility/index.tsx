import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { MobilityList } from '@/components/Mobility/MobilityList';

const MobilityPage = () => {
  useAuth();
  return (
    <DashboardLayout title="移動支援">
      <PageContainer title="移動支援" fluid>
        <Link href={getPath('MOBILITY_CREATE')}>
          <a>
            <CustomButton>実績記録票を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <MobilityList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default MobilityPage;
