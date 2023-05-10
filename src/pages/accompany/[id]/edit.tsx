import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { AccompanyCreate } from '@/components/Accompany/AccompanyCreate';

const AccompanyEditPage: NextPage = () => {
  return (
    <DashboardLayout title="記録票編集">
      <PageContainer title="実績記録票編集" fluid>
        <AccompanyCreate type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default AccompanyEditPage;
