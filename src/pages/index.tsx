import type { CustomNextPage } from 'next';
import Link from 'next/link';
import { Paper, SimpleGrid } from '@mantine/core';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { ITEMS } from '@/components/Layout/DashboardLayout/SideNav';
import { useAuth } from '@/hooks/auth/useAuth';
import { TOP } from '@/utils';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Index: CustomNextPage = () => {
  const router = useRouter();
  useAuth();
  useEffect(() => {
    router.push('/restart');
  }, []);

  return (
    <DashboardLayout title={TOP}>
      <PageContainer title={TOP} fluid>
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
