import { CustomButton } from '@/components/Common/CustomButton';
import { HomeCareSupportCreate } from '@/components/HomeCareSupport/HomeCareSupportCreate';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { User } from '@/ducks/user/slice';
import { useLoginUser } from '@/libs/mantine/useLoginUser';
import { supabase } from '@/libs/supabase/supabase';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  userList: User[];
};

const HomeCareSupportCreatePage: NextPage<Props> = ({ userList }) => {
  return (
    <DashboardLayout title="記録票作成">
      <PageContainer title="実績記録票作成" fluid>
        <Space h="md" />
        <HomeCareSupportCreate userList={userList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default HomeCareSupportCreatePage;

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
