import { AccompanyingSupportList } from '@/components/AccompanyingSupport/AccompanyingSupportList';
import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ReturnAccompanyingSupport } from '@/ducks/accompanying-support/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  accompanyingSupportList: ReturnAccompanyingSupport[];
};

const AccompanyingSupportPage: NextPage<Props> = ({
  accompanyingSupportList,
}) => {
  return (
    <DashboardLayout title="同行援護">
      <PageContainer title="同行援護" fluid>
        <Space h="md" />
        <Link href={getPath('ACCOMPANYING_SUPPPORT_CREATE')}>
          <a>
            <CustomButton>実績記録票を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <AccompanyingSupportList
          accompanyingSupportList={accompanyingSupportList}
        />
      </PageContainer>
    </DashboardLayout>
  );
};

export default AccompanyingSupportPage;

export const getStaticProps = async () => {
  const { data: accompanyingSupportList } = await supabase
    .from(getDb('ACCOMPANYING'))
    .select('*')
    .order('updated_at', { ascending: false });
  return {
    props: {
      accompanyingSupportList,
    },
  };
};
