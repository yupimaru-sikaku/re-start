import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffEditForm } from '@/components/Staff/StaffEditForm';
import { ReturnStaff } from '@/ducks/staff/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { Space } from '@mantine/core';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import React from 'react';

type Props = {
  staffData: ReturnStaff;
};

const StaffEditPage: NextPage<Props> = ({ staffData }) => {
  return (
    <DashboardLayout title="スタッフ情報編集">
      <PageContainer title="情報編集" fluid>
        <Space h="md" />
        <StaffEditForm staffData={staffData} />
      </PageContainer>
    </DashboardLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const { data, error } = await supabase.from(getDb('STAFF')).select('id');

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
  const { data: staffData, error } = await supabase
    .from(getDb('STAFF'))
    .select('*')
    .eq('id', ctx.params.id)
    .single();

  if (error || !staffData) {
    return { notFound: true };
  }

  return {
    props: { staffData },
  };
};

export default StaffEditPage;
