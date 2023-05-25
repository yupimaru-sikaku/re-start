import React from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { HomeCareCreate } from '@/components/HomeCare/HomeCareCreate';

const HomeCareEditPage: NextPage = () => {
  return (
    <DashboardLayout title="実績記録票編集（居宅介護）">
      <PageContainer title="実績記録票編集（居宅介護）" fluid>
        <HomeCareCreate type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default HomeCareEditPage;
