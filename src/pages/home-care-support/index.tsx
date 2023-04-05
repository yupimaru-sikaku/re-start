import { CustomButton } from '@/components/Common/CustomButton';
import { HomeCareSupportList } from '@/components/HomeCareSupport/HomeCareSupportList';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ReturnHomeCareSupport } from '@/ducks/home-care-support/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Space } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

type Props = {
  homeCareSupportList: ReturnHomeCareSupport[];
};

const HomeCareSupportPage: NextPage<Props> = ({ homeCareSupportList }) => {
  const router = useRouter();
  const moveToCreate = useCallback(() => {
    router.push(getPath('HOME_CARE_SUPPORT_CREATE'));
  }, []);

  return (
    <DashboardLayout title="居宅介護">
      <PageContainer title="居宅介護" fluid>
        <Space h="md" />
        <CustomButton onClick={moveToCreate}>実績記録票を作成する</CustomButton>
        <Space h="md" />
        <HomeCareSupportList homeCareSupportList={homeCareSupportList} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default HomeCareSupportPage;

export const getStaticProps = async () => {
  const { data: homeCareSupportList } = await supabase
    .from(getDb('HOME_CARE_RECORD'))
    .select('*')
    .order('updated_at', { ascending: false });
  return {
    props: {
      homeCareSupportList,
    },
  };
};
