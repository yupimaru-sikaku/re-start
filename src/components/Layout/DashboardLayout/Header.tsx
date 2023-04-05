import { FC, ReactNode } from 'react';
import {
  Box,
  Container,
  createStyles,
  Paper,
  SimpleGrid,
  Space,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/libs/mantine/useAuth';
import { useRouter } from 'next/router';
import { getBreadcrumbs } from '@/libs/breadcrumbs';
import { CustomBreadcrumbs } from '@/components/Common/CustomBreadcrumbs';

const useStyles = createStyles<string, { collapsed?: boolean }>(
  (theme, params, getRef) => {
    return {
      header: {
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
      },
    };
  }
);

export const Header: FC<{ left: ReactNode }> = () => {
  const [collapsed, handlers] = useDisclosure(false);
  const { user } = useAuth();
  const router = useRouter();
  const items = getBreadcrumbs(router.asPath);

  return (
    <Container
      sx={(theme) => ({ borderBottom: `1px solid ${theme.colors.gray[2]}` })}
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
