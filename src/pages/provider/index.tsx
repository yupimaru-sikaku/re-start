import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { CustomButton } from '@/components/Common/CustomButton';
import { ProviderList } from '@/components/Provider/ProviderList';
import { getPath } from '@/utils/const/getPath';
import { useAuth } from '@/hooks/auth/useAuth';
import { Space } from '@mantine/core';
import { useSelector } from '@/ducks/store';

const ProviderPage: NextPage = () => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  useAuth();
  return (
    <DashboardLayout title="事業所情報">
      <PageContainer title="事業所情報" fluid>
        {loginProviderInfo.role !== 'office' && (
          <Link href={getPath('PROVIDER_CREATE')}>
            <a>
              <CustomButton>事業所情報登録</CustomButton>
            </a>
          </Link>
        )}
        <Space h="md" />
        <ProviderList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default ProviderPage;
