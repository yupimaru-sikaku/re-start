import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import 'src/styles/globals.css';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
      }}
    >
      <NotificationsProvider limit={3}>
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  );
}
