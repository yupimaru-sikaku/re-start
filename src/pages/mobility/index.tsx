import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { CustomButton } from '@/components/Common/CustomButton';
import { MobilityList } from '@/components/Mobility/MobilityList';
import { getPath } from '@/utils/const/getPath';
import { useAuth } from '@/hooks/auth/useAuth';
import { Space } from '@mantine/core';

const MobilityPage: NextPage = () => {
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
