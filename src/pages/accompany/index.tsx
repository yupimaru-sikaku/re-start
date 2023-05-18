import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { CustomButton } from '@/components/Common/CustomButton';
import { AccompanyList } from '@/components/Accompany/AccompanyList';
import { getPath } from '@/utils/const/getPath';
import { useAuth } from '@/hooks/auth/useAuth';
import { Space } from '@mantine/core';

const AccompanyPage: NextPage = () => {
  useAuth();
  return (
    <DashboardLayout title="同行援護">
      <PageContainer title="同行援護" fluid>
        <Link href={getPath('ACCOMPANY_CREATE')}>
          <a>
            <CustomButton>実績記録票を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <AccompanyList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default AccompanyPage;
