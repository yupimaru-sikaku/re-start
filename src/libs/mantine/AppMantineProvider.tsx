import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { FC, ReactNode } from 'react';
import { getTheme } from './theme';

export const AppMantineProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={getTheme('light')}
    >
      <NotificationsProvider limit={3} autoClose={2000}>
        {children}
      </NotificationsProvider>
    </MantineProvider>
  );
};
