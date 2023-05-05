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
import { ITEMS } from '@/components/Layout/DashboardLayout/SideNav';

const Index: CustomNextPage = () => {
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
          {ITEMS.map((service) => (
            <Link href={service.href} passHref key={service.label}>
              <a>
                <Paper
                  p="xl"
                  shadow="xs"
                  sx={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <service.Icon />
                  {service.label}
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
