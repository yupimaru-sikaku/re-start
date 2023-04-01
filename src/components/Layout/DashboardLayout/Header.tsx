import { FC, ReactNode } from 'react';
import { Box, Container, createStyles, Paper, Space } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/ducks/user/slice';

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

  return (
    <Container
      sx={(theme) => ({ borderBottom: `1px solid ${theme.colors.gray[2]}` })}
    >
      <Space h="sm" />
      {user ? (
        <p>ログイン中</p>
      ) : (
        <p>
          <br />
        </p>
      )}
    </Container>
  );
};
