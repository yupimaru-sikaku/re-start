import { createContext, useEffect, useState } from 'react';
import { AppMantineProvider } from 'src/libs/mantine/AppMantineProvider';
import { GlobalStyleProvider } from 'src/libs/mantine/GlobalStyleProvider';
import type { CustomAppPage } from 'next/app';
import { supabase } from '@/libs/supabase/supabase';

export const AuthContext = createContext({
  user: null,
  supabase: null,
});

const App: CustomAppPage = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recover the user session on page refresh
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);

    // Listen for changes to the user session (e.g., login, logout, and token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      // authListener?.unsubscribe();
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
