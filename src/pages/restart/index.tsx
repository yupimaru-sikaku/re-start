import { CustomButton } from '@/components/Common/CustomButton';
import { RestartDashboardLayout } from '@/components/Layout/DashboardLayout/RestartDashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { RestartList } from '@/components/Restart/RestartList';
import { useAuth } from '@/hooks/auth/useAuth';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const RestartPage = () => {
  useAuth();
  return (
    <RestartDashboardLayout title="一覧表">
      <PageContainer title="実施記録一覧表" fluid>
        <Link href={getPath('RESTART_CREATE')}>
          <a>
            <CustomButton>実施記録を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <RestartList />
      </PageContainer>
    </RestartDashboardLayout>
  );
};

export default RestartPage;
