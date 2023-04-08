import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ReturnAccompanyingSupport } from '@/ducks/accompanying-support/slice';
import { User } from '@/ducks/user/slice';
import { Space } from '@mantine/core';
import React from 'react';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { AccompanyingSupportEdit } from '@/components/AccompanyingSupport/AccompanyingSupportEdit';

type Props = {
  userData: ReturnAccompanyingSupport;
  userList: User[];
};

const AccompanyingSupportEditPage: NextPage<Props> = ({
  userData,
  userList,
}) => {
  return (
    <DashboardLayout title="記録票編集">
      <PageContainer title="実績記録票編集" fluid>
        <Space h="md" />
        <AccompanyingSupportEdit userData={userData} userList={userList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const { data, error } = await supabase
    .from(getDb('ACCOMPANYING'))
    .select('id');

  if (error || !data) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const paths = data.map((record) => ({
    params: { id: record.id.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (
  ctx: GetStaticPropsContext<{ id: string }>
) => {
  if (!ctx.params) {
    return { notFound: true };
  }
  const { data: userData, error } = await supabase
    .from(getDb('ACCOMPANYING'))
    .select('*')
    .eq('id', ctx.params.id)
    .single();

  if (error || !userData) {
    return { notFound: true };
  }
  const { data: userList } = await supabase
    .from(getDb('USER'))
    .select('*')
    .order('updated_at', { ascending: false });

  return {
    props: { userData, userList },
  };
};

export default AccompanyingSupportEditPage;
