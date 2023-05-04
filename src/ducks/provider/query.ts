import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreateProviderWithSignUpParams,
  CreateProviderWithSignUpResult,
  LoginParams,
  LoginResult,
  UpdateProviderParams,
  UpdateProviderResult,
} from 'src/ducks/provider/slice';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Provider'],
  endpoints: (builder) => ({
    /**
     * POST/作成
     * @param {CreateProviderWithSignUpParams} params
     * @return {CreateProviderWithSignUpResult}
     */
    createProviderWithSignUp: builder.mutation<
      CreateProviderWithSignUpResult,
      CreateProviderWithSignUpParams
    >({
      // TODO 型付け
      queryFn: async (params: CreateProviderWithSignUpParams): Promise<any> => {
        const { data, error } = await supabase.auth.signUp({
          email: params.email,
          password: params.password,
        });
        return { data, error };
      },
    }),
    /**
     * POST/ログイン
     * @param {LoginParams} params
     * @return {LoginResult}
     */
    login: builder.mutation<LoginResult, LoginParams>({
      // TODO 型付け
      queryFn: async (params: LoginParams): Promise<any> => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: params.email,
          password: params.password,
        });
        return { data, error };
      },
    }),
    /**
     * GET/idから情報を取得
     * @param {string} id
     * @return {ReturnProvider}
     */
    getProviderById: builder.query({
      queryFn: async (id: string) => {
        const { data, error } = await supabase
          .from(getDb('PROVIDER'))
          .select('*')
          .eq('id', id);
        return data ? { data: data[0] } : { error };
      },
    }),
    /**
     * PUT/更新
     * @param {UpdateProviderParams} params
     * @return {CreateProviderResult}
     */
    updateProvider: builder.mutation<
      UpdateProviderResult,
      UpdateProviderParams
    >({
      queryFn: async (params: UpdateProviderParams) => {
        const { error } = await supabase
          .from(getDb('PROVIDER'))
          .update({
            user_id: params.user_id,
            corporate_id: params.corporate_id,
            corporate_name: params.corporate_name,
            office_name: params.office_name,
            email: params.email,
          })
          .eq('id', params.id);
        return { error };
      },
    }),
  }),
});

export const {
  useCreateProviderWithSignUpMutation,
  useLoginMutation,
  useGetProviderByIdQuery,
  useUpdateProviderMutation,
} = providerApi;
