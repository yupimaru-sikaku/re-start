import { createContext, useEffect, useState } from 'react';
import { AppMantineProvider } from 'src/libs/mantine/AppMantineProvider';
import { GlobalStyleProvider } from 'src/libs/mantine/GlobalStyleProvider';
import type { CustomAppPage } from 'next/app';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { ReturnProvider } from '@/ducks/provider/slice';
import { Provider } from 'react-redux';
import { store } from '@/ducks/store';

type LoginUser = {
  id: string;
};

type AuthContextType = {
  loginUser: LoginUser | null;
  provider: ReturnProvider | null;
  supabase: typeof supabase;
};

export const AuthContext = createContext<AuthContextType>({
  loginUser: { id: '' },
  provider: null,
  supabase: supabase,
});

const App: CustomAppPage = ({ Component, pageProps }) => {
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [provider, setProvider] = useState<any>(null);

  const setUserFromSession = (session: Session | null) => {
    setLoginUser(session ? { id: session.user?.id ?? null } : null);
  };

  const setProviderSession = async (session: Session | null) => {
    if (!session) return;
    const { data } = await supabase
      .from(getDb('PROVIDER'))
      .select('*')
      .eq('id', session.user?.id);
    if (data) {
      setProvider(data[0]);
    }
  };

  useEffect(() => {
    // Recover the user session on page refresh
    // const session = supabase.auth.session();
    // setUserFromSession(session);

    // Listen for changes to the user session (e.g., login, logout, and token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUserFromSession(session);
        setProviderSession(session);
      }
    );

    // Clean up the auth listener on unmount
    return () => {
      // authListener.unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ loginUser, provider, supabase }}>
        <GlobalStyleProvider>
          <AppMantineProvider>
            <Component {...pageProps} />
          </AppMantineProvider>
        </GlobalStyleProvider>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;
