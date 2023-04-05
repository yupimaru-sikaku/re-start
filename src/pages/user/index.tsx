import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { UserList } from '@/components/User/UserList';
import { User } from '@/ducks/user/slice';
import { useAuth } from '@/libs/mantine/useAuth';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

type Props = {
  userList: User[];
};

const UserPage: NextPage<Props> = ({ userList }) => {
  const router = useRouter();
  const moveToCreate = useCallback(() => {
    router.push(getPath('USER_REGISTER'));
  }, []);

  return (
    <DashboardLayout title="利用者情報">
      <PageContainer title="利用者情報" fluid>
        <Space h="md" />
        <CustomButton onClick={moveToCreate}>利用者情報登録</CustomButton>
        <Space h="md" />
        <UserList userList={userList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default UserPage;

export const getStaticProps = async () => {
  const { data: userList } = await supabase
    .from(getDb('USER'))
    .select('*')
    .order('updated_at', { ascending: false });
  return {
    props: {
      userList,
    },
  };
};
