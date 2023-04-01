import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { FC, ReactNode } from 'react';

export const AppMantineProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <NotificationsProvider limit={3} autoClose={2000}>
        {children}
      </NotificationsProvider>
    </MantineProvider>
  );
};
