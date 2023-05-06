import { AccompanyList } from '@/components/Accompany/AccompanyList';
import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ReturnAccompany } from '@/ducks/accompany/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

type Props = {
  accompanyList: ReturnAccompany[];
};

const AccompanyPage: NextPage<Props> = ({ accompanyList }) => {
  return (
    <DashboardLayout title="同行援護">
      <PageContainer title="同行援護" fluid>
        <Link href={getPath('Accompany_CREATE')}>
          <a>
            <CustomButton>実績記録票を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <AccompanyList accompanyList={accompanyList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default AccompanyPage;

export const getStaticProps = async () => {
  const { data: accompanyList } = await supabase
    .from(getDb('Accompany'))
    .select('*')
    .order('updated_at', { ascending: false });
  return {
    props: {
      accompanyList,
    },
  };
};
