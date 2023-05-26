import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { CustomButton } from '@/components/Common/CustomButton';
import { HomeCareList } from '@/components/HomeCare/HomeCareList';
import { getPath } from '@/utils/const/getPath';
import { useAuth } from '@/hooks/auth/useAuth';
import { Space } from '@mantine/core';
import { KYOTAKU } from '@/utils';

const HomeCarePage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title={KYOTAKU}>
      <PageContainer title={KYOTAKU} fluid>
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
