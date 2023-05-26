import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { FC, ReactNode } from 'react';
import { getTheme } from './theme';
import { useSelector } from '@/ducks/store';

export const AppMantineProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const themeMode = useSelector((state) => state.global.themeMode);
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles theme={getTheme(themeMode)}>
      <NotificationsProvider limit={3} autoClose={2000}>
        {children}
      </NotificationsProvider>
    </MantineProvider>
  );
};
