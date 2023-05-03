import { HomeCareSupportEdit } from '@/components/HomeCareSupport/HomeCareSupportEdit';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ReturnHomeCareSupport } from '@/ducks/home-care-support/slice';
import { ReturnStaff } from '@/ducks/staff/slice';
import { User } from '@/ducks/user/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { Space } from '@mantine/core';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import React from 'react';

type Props = {
  userData: ReturnHomeCareSupport;
  userList: User[];
  staffList: ReturnStaff[];
};

const HomeCareSupportEditPage: NextPage<Props> = ({
  userData,
  userList,
  staffList,
}) => {
  return (
    <DashboardLayout title="記録票編集">
      <PageContainer title="実績記録票編集" fluid>
        <HomeCareSupportEdit
          userData={userData}
          userList={userList}
          staffList={staffList}
        />
      </PageContainer>
    </DashboardLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const { data, error } = await supabase.from(getDb('HOME_CARE')).select('id');

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
    .from(getDb('HOME_CARE'))
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

  const { data: staffList } = await supabase
    .from(getDb('STAFF'))
    .select('*')
    .or('is_kaigo.eq.true,is_syoninsya.eq.true,is_zitsumusya.eq.true');

  return {
    props: { userData, userList, staffList },
  };
};

export default HomeCareSupportEditPage;
