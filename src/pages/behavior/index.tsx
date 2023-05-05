import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { BehaviorList } from '@/components/Behavior/BehaviorList';
import { PageContainer } from '@/components/PageContainer';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const BehaviorPage = () => {
  return (
    <DashboardLayout title="行動援護">
      <PageContainer title="行動援護" fluid>
        <Link href={getPath('BEHAVIOR_CREATE')}>
          <a>
            <CustomButton>実績記録票を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <BehaviorList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default BehaviorPage;
