import { FC, ReactNode } from 'react';
import { Container, SimpleGrid, Space } from '@mantine/core';
import { useLoginUser } from '@/libs/mantine/useLoginUser';
import { useRouter } from 'next/router';
import { getBreadcrumbs } from '@/libs/breadcrumbs';
import { CustomBreadcrumbs } from '@/components/Common/CustomBreadcrumbs';

export const Header: FC<{ left: ReactNode }> = () => {
  const { loginUser } = useLoginUser();
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
        {loginUser ? (
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
