import { AppMantineProvider } from 'src/libs/mantine/AppMantineProvider';
import { GlobalStyleProvider } from 'src/libs/mantine/GlobalStyleProvider';
import type { CustomAppPage } from 'next/app';
import { Provider } from 'react-redux';
import { persistor, store } from '@/ducks/store';
import { PersistGate } from 'redux-persist/integration/react';
import React from 'react';

const App: CustomAppPage = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalStyleProvider>
          <AppMantineProvider>
            <Component {...pageProps} />
          </AppMantineProvider>
        </GlobalStyleProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
