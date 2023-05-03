import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffList } from '@/components/Staff/StaffList';
import { getPath } from '@/utils/const/getPath';
import { Group, Space } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

const StaffPage: NextPage = () => {
  return (
    <DashboardLayout title="スタッフ情報">
      <PageContainer title="スタッフ情報" fluid>
        <Group>
          <Link href={getPath('STAFF_REGISTER')}>
            <a>
              <CustomButton>スタッフ情報登録</CustomButton>
            </a>
          </Link>
        </Group>
        <Space h="md" />
        <StaffList />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StaffPage;
