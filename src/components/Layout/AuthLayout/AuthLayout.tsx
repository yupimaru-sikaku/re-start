import { Center, Container } from '@mantine/core';
import type { CustomLayout } from 'next';
import Head from 'next/head';

import { LayoutErrorBoundary } from '../LayoutErrorBoundary';

export const AuthLayout: CustomLayout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{`${title} | リスタート`}</title>
      </Head>
      <Center
        sx={(theme) => ({
          minHeight: '100vh',
          backgroundColor: theme.colors.gray[0],
        })}
      >
        <Container size="xs" sx={{ width: 480, paddingBottom: 16 }}>
          <LayoutErrorBoundary>{children}</LayoutErrorBoundary>
        </Container>
      </Center>
    </>
  );
};
