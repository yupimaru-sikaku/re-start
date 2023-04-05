import { createContext, useEffect, useState } from 'react';
import { AppMantineProvider } from 'src/libs/mantine/AppMantineProvider';
import { GlobalStyleProvider } from 'src/libs/mantine/GlobalStyleProvider';
import type { CustomAppPage } from 'next/app';
import { supabase } from '@/libs/supabase/supabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

type User = {
  id: string | null;
};

type AuthContextType = {
  user: User | null;
  supabase: typeof supabase;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  supabase: supabase,
});

const App: CustomAppPage = ({ Component, pageProps }) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserFromSession = (session: Session | null) => {
    setUser(session ? { id: session.user?.id ?? null } : null);
  };

  useEffect(() => {
    // Recover the user session on page refresh
    // const session = supabase.auth.session();
    // setUserFromSession(session);

    // Listen for changes to the user session (e.g., login, logout, and token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUserFromSession(session);
      }
    );

    // Clean up the auth listener on unmount
    return () => {
      // authListener.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, supabase }}>
      <GlobalStyleProvider>
        <AppMantineProvider>
          <Component {...pageProps} />
        </AppMantineProvider>
      </GlobalStyleProvider>
    </AuthContext.Provider>
  );
};

export default App;
