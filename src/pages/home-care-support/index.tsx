import { CustomButton } from '@/components/Common/CustomButton';
import { HomeCareSupportList } from '@/components/HomeCareSupport/HomeCareSupportList';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ReturnHomeCareSupport } from '@/ducks/home-care-support/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

type Props = {
  homeCareSupportList: ReturnHomeCareSupport[];
};

const HomeCareSupportPage: NextPage<Props> = ({ homeCareSupportList }) => {
  return (
    <DashboardLayout title="居宅介護">
      <PageContainer title="居宅介護" fluid>
        <Link href={getPath('HOME_CARE_SUPPORT_CREATE')}>
          <a>
            <CustomButton>実績記録票を作成する</CustomButton>
          </a>
        </Link>
        <Space h="md" />
        <HomeCareSupportList homeCareSupportList={homeCareSupportList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default HomeCareSupportPage;

export const getStaticProps = async () => {
  const { data: homeCareSupportList } = await supabase
    .from(getDb('HOME_CARE'))
    .select('*')
    .order('updated_at', { ascending: false });
  return {
    props: {
      homeCareSupportList,
    },
  };
};
