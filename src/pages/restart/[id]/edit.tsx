import { CustomButton } from '@/components/Common/CustomButton';
import { RestartDashboardLayout } from '@/components/Layout/DashboardLayout/RestartDashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { RestartCreate } from '@/components/Restart/RestartCreate';
import { RestartEdit } from '@/components/Restart/RestartEdit';
import { useAuth } from '@/hooks/auth/useAuth';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const RestartEditPage = () => {
  useAuth();
  return (
    <RestartDashboardLayout title="実施記録編集">
      <PageContainer title="実施記録編集" fluid>
        <RestartEdit type="edit" />
      </PageContainer>
    </RestartDashboardLayout>
  );
};

export default RestartEditPage;
