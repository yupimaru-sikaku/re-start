import { AccompanyingSupportCreate } from '@/components/AccompanyingSupport/AccompanyingSupportCreate';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { User } from '@/ducks/user/slice';
import { supabase } from '@/libs/supabase/supabase';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  userList: User[];
};

const AccompanyingSupportPage: NextPage<Props> = ({ userList }) => {
  return (
    <DashboardLayout title="記録票作成">
      <PageContainer title="実績記録票作成" fluid>
        <Space h="md" />
        <AccompanyingSupportCreate userList={userList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default AccompanyingSupportPage;

export const getStaticProps = async () => {
  const { data: userList } = await supabase
    .from('users')
    .select('*')
    .order('updated_at', { ascending: false });
  return {
    props: {
      userList,
    },
  };
};
