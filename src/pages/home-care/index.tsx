import { CustomButton } from '@/components/Common/CustomButton';
import { HomeCareList } from '@/components/HomeCare/HomeCareList';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { useAuth } from '@/hooks/auth/useAuth';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

const HomeCarePage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="居宅介護">
      <PageContainer title="居宅介護" fluid>
        <Link href={getPath('HOME_CARE_CREATE')}>
          <a>
            <CustomButton>実績記録票を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <HomeCareList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default HomeCarePage;
