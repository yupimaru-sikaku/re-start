import { Paper, SimpleGrid } from '@mantine/core';
import type { CustomNextPage } from 'next';
import { DashboardLayout } from 'src/components/Layout/DashboardLayout/DashboardLayout';
import Link from 'next/link';
import { PageContainer } from '@/components/PageContainer';
import { ITEMS } from '@/components/Layout/DashboardLayout/SideNav';
import { useAuth } from '@/hooks/auth/useAuth';

const Index: CustomNextPage = () => {
  useAuth();
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
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
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
