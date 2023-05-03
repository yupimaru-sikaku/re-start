import { CustomButton } from '@/components/Common/CustomButton';
import { HomeCareSupportList } from '@/components/HomeCareSupport/HomeCareSupportList';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

const HomeCareSupportPage: NextPage = () => {
  return (
    <DashboardLayout title="居宅介護">
      <PageContainer title="居宅介護" fluid>
        <Link href={getPath('HOME_CARE_SUPPORT_CREATE')}>
          <a>
            <CustomButton>実績記録票を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <HomeCareSupportList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default HomeCareSupportPage;
