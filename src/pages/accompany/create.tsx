import { AccompanyCreate } from '@/components/Accompany/AccompanyCreate';
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

const AccompanyPage: NextPage<Props> = ({ userList }) => {
  return (
    <DashboardLayout title="記録票作成">
      <PageContainer title="実績記録票作成" fluid>
        <Space h="md" />
        <AccompanyCreate userList={userList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default AccompanyPage;

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
