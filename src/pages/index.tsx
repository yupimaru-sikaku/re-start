import { Paper, SimpleGrid } from '@mantine/core';
import type { CustomNextPage } from 'next';
import { DashboardLayout } from 'src/components/Layout/DashboardLayout/DashboardLayout';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';
import { PageContainer } from '@/components/PageContainer';
import { User } from 'tabler-icons-react';
import { IconFriends, IconToolsKitchen2, IconWalk } from '@tabler/icons';
import { useGetProviderByIdQuery } from '@/ducks/provider/query';
import { useSelector } from '@/ducks/store';
import { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query';

const SERVICE_LINK = [
  { url: 'USER', title: '利用者情報', icon: <User /> },
  { url: 'STAFF', title: 'スタッフ情報', icon: <User /> },
  { url: 'ACCOMPANYING_SUPPPORT', title: '同行援護', icon: <IconFriends /> },
  { url: 'BEHAVIOR_SUPPPORT', title: '行動援護', icon: <IconWalk /> },
  { url: 'HOME_CARE_SUPPORT', title: '居宅介護', icon: <IconToolsKitchen2 /> },
  { url: 'MOBILITY_SUPPORT', title: '移動支援', icon: <IconWalk /> },
] as const;

const Index: CustomNextPage = () => {
  const loginProviderInfo = useSelector(
    (state) => state.provider.loginProviderInfo
  );
  const { data: providerData } = useGetProviderByIdQuery(
    loginProviderInfo.id || skipToken
  );
  return (
    <DashboardLayout title="トップページ">
      <PageContainer title="ホーム" fluid>
        <SimpleGrid
          breakpoints={[
            { minWidth: 'sm', cols: 2 },
            { minWidth: 'md', cols: 3 },
            { minWidth: 'xl', cols: 4 },
          ]}
        >
          {SERVICE_LINK.map((service) => (
            <Link href={getPath(service.url)} passHref key={service.url}>
              <a>
                <Paper
                  p="xl"
                  shadow="xs"
                  sx={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  {service.icon}
                  {service.title}
                </Paper>
              </a>
            </Link>
          ))}
        </SimpleGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Index;
