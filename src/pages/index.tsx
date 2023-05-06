import { Box, Paper, SimpleGrid } from '@mantine/core';
import type { CustomNextPage } from 'next';
import { DashboardLayout } from 'src/components/Layout/DashboardLayout/DashboardLayout';
import Link from 'next/link';
import { PageContainer } from '@/components/PageContainer';
import { ITEMS } from '@/components/Layout/DashboardLayout/SideNav';
import { useAuth } from '@/hooks/auth/useAuth';
import { Logout } from 'tabler-icons-react';
import { useAppDispatch } from '@/ducks/store';
import { clearLoginProviderInfo } from '@/ducks/provider/slice';
import { supabase } from '@/libs/supabase/supabase';

const Index: CustomNextPage = () => {
  const dispatch = useAppDispatch();
  useAuth();
  const handleLogout = async () => {
    dispatch(clearLoginProviderInfo());
    await supabase.auth.signOut();
  };
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
          <Box sx={{ cursor: 'pointer' }} onClick={handleLogout}>
            <Paper
              p="xl"
              shadow="xs"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Logout />
              ログアウト
            </Paper>
          </Box>
        </SimpleGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Index;
