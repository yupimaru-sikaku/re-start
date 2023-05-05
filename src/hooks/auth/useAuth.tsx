import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPath } from '@/utils/const/getPath';
import { supabase } from '@/libs/supabase/supabase';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(
    undefined
  );
  const router = useRouter();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setAccessToken(newSession?.access_token || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (accessToken === null && router.asPath !== getPath('SIGN_IN')) {
      router.push(getPath('SIGN_IN'));
    }
  }, [accessToken, router]);
};
