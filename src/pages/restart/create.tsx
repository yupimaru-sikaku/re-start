import { CustomButton } from '@/components/Common/CustomButton';
import { RestartDashboardLayout } from '@/components/Layout/DashboardLayout/RestartDashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { RestartCreate } from '@/components/Restart/RestartCreate';
import { useAuth } from '@/hooks/auth/useAuth';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const RestartCreatePage = () => {
  useAuth();
  return (
    <RestartDashboardLayout title="実施記録作成">
      <PageContainer title="実施記録作成" fluid>
        <RestartCreate type="create" />
      </PageContainer>
    </RestartDashboardLayout>
  );
};

export default RestartCreatePage;
