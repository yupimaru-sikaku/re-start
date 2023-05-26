import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { CustomButton } from '@/components/Common/CustomButton';
import { BehaviorList } from '@/components/Behavior/BehaviorList';
import { getPath } from '@/utils/const/getPath';
import { useAuth } from '@/hooks/auth/useAuth';
import { Space } from '@mantine/core';
import { KODO } from '@/utils';

const BehaviorPage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title={KODO}>
      <PageContainer title={KODO} fluid>
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
