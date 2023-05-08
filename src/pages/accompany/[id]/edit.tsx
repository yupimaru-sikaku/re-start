import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ReturnAccompany } from '@/ducks/accompany/slice';
import { User } from '@/ducks/user/slice';
import { Space } from '@mantine/core';
import React from 'react';
import {
  GetStaticPaths,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { AccompanyCreate } from '@/components/Accompany/AccompanyCreate';

type Props = {
  userData: ReturnAccompany;
  userList: User[];
};

const AccompanyEditPage: NextPage<Props> = ({
  userData,
  userList,
}) => {
  return (
    <DashboardLayout title="記録票編集">
      <PageContainer title="実績記録票編集" fluid>
        <Space h="md" />
        <AccompanyCreate type="edit" />
      </PageContainer>
    </DashboardLayout>
  );
};

export default AccompanyEditPage;
