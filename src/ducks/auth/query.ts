import { supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    /**
     * POST/パスワードの再設定
     * @param {string} password
     * @return {}
     */
    resetPassword: builder.mutation({
      queryFn: async (password: string): Promise<any> => {
        const { error } = await supabase.auth.updateUser({ password });
        return { error };
      },
    }),
    /**
     * POST/パスワード再設定のためのメールアドレス送信
     * @param {string} email
     * @return {}
     */
    resetPasswordForEmail: builder.mutation({
      queryFn: async (email: string): Promise<any> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_BASEURL}${getPath('RESET_PASSWORD')}`,
        });
        return { error };
      },
    }),
  }),
});

export const { useResetPasswordMutation, useResetPasswordForEmailMutation } = authApi;
