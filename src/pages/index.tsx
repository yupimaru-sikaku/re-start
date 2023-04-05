import { Paper, SimpleGrid } from '@mantine/core';
import type { CustomNextPage } from 'next';
import { DashboardLayout } from 'src/components/Layout/DashboardLayout/DashboardLayout';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';
import { PageContainer } from '@/components/PageContainer';
import Head from 'next/head';

const SERVICE_LINK = [
  { url: 'USER', title: '利用者情報' },
  { url: 'ACCOMPANYING_SUPPPORT', title: '同行援護' },
  { url: 'BEHAVIOR_SUPPPORT', title: '行動援護' },
  { url: 'HOME_CARE_SUPPORT', title: '居宅介護' },
  { url: 'MOBILITY_SUPPORT', title: '移動支援' },
] as const;

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
          {SERVICE_LINK.map((service) => (
            <Link href={getPath(service.url)} passHref key={service.url}>
              <a>
                <Paper>{service.title}</Paper>
              </a>
            </Link>
          ))}
        </SimpleGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Index;
