import { FC, useEffect } from 'react';
import type { CustomLayout } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, AppShell, Box, CloseButton, Drawer, MediaQuery } from '@mantine/core';
import Head from 'next/head';

import { LayoutErrorBoundary } from '../LayoutErrorBoundary';

const SideNav = dynamic(async () => {
  const { RestartSideNav } = await import('./RestartSideNav');
  return RestartSideNav;
});

export const RestartDashboardLayout: CustomLayout = ({ children, title }) => {
  const [opened, handlers] = useDisclosure(false);

  return (
    <>
      <Head>
        <title>{`${title} | リスタート`}</title>
      </Head>

      <AppShell
        styles={(theme) => ({
          body: { minHeight: '100vh' },
          main: { backgroundColor: theme.colors.gray[0], padding: 0, minWidth: '900px', overflow: 'auto' },
        })}
        navbar={
          <>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <SideNav />
            </MediaQuery>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <DrawerNav opened={opened} handleClose={handlers.close} />
            </MediaQuery>
          </>
        }
      >
        <Box py="xl" px="md">
          <LayoutErrorBoundary>{children}</LayoutErrorBoundary>
        </Box>
      </AppShell>
    </>
  );
};

const DrawerNav: FC<{ opened: boolean; handleClose: () => void }> = ({ opened, handleClose }) => {
  const router = useRouter();

  // SideNav のメニュークリックで Drawer を閉じる処理
  useEffect(() => {
    router.events.on('routeChangeStart', handleClose);
    return () => {
      router.events.off('routeChangeStart', handleClose);
    };
  }, [handleClose, router.events]);

  return (
    <Drawer opened={opened} onClose={handleClose} size="auto" withCloseButton={false} sx={{ position: 'relative' }}>
      <CloseButton
        size="xl"
        radius="xl"
        variant="transparent"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          zIndex: 999,
          top: 8,
          right: -56,
          color: 'white',
          '&:not(:disabled):active': { transform: 'none' },
        }}
      />
      <SideNav />
    </Drawer>
  );
};
