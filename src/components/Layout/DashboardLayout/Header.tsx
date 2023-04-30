import { FC, ReactNode } from 'react';
import { Container, SimpleGrid, Space } from '@mantine/core';
import { useAuth } from '@/libs/mantine/useAuth';
import { useRouter } from 'next/router';
import { getBreadcrumbs } from '@/libs/breadcrumbs';
import { CustomBreadcrumbs } from '@/components/Common/CustomBreadcrumbs';

export const Header: FC<{ left: ReactNode }> = () => {
  const { user } = useAuth();
  const router = useRouter();
  const items = getBreadcrumbs(router.asPath);

  return (
    <Container
      sx={(theme) => ({
        maxWidth: '100%',
        background: theme.white,
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
        margin: 0,
      })}
    >
      <Space h="sm" />
      <SimpleGrid cols={2}>
        <CustomBreadcrumbs items={items} />
        {user ? (
          <p>ログイン中</p>
        ) : (
          <p>
            <br />
          </p>
        )}
      </SimpleGrid>
    </Container>
  );
};
