import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateProviderWithSignUpParams, LoginParams, LoginResult, UpdateProviderParams } from '@/ducks/provider/slice';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Provider'],
  endpoints: (builder) => ({
    /**
     * GET/全体のリストを取得
     * @param {}
     * @return {ReturnProvider[]}
     */
    getProviderList: builder.query({
      queryFn: async (): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('PROVIDER'))
          .select('*')
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/法人IDに属するリストを取得
     * @param {string} corporate_id
     * @return {ReturnProvider[]}
     */
    getProviderListByCorporateId: builder.query({
      queryFn: async (corporate_id: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('PROVIDER'))
          .select('*')
          .eq('is_display', true)
          .eq('corporate_id', corporate_id)
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * POST/作成
     * @param {CreateProviderWithSignUpParams} params
     * @return {CreateProviderWithSignUpResult}
     */
    createProviderWithSignUp: builder.mutation({
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
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: params.email,
          password: params.password,
        });
        if (signInData.user) {
          const { data: providerData, error: providerError } = await supabase
            .from(getDb('PROVIDER'))
            .select('*')
            .eq('login_id', signInData.user.id);
          if (providerError) return { error: providerError };
          const returnData = {
            id: signInData.user.id,
            email: signInData.user.email,
            corporate_id: providerData[0].corporate_id,
            corporate_name: providerData[0].corporate_name,
            office_name: providerData[0].office_name,
            role: providerData[0].role,
          };
          return { data: returnData };
        }
        return { error: signInError };
      },
    }),
    /**
     * GET/idから情報を取得
     * @param {string} id
     * @return {ReturnProvider}
     */
    getProviderById: builder.query({
      queryFn: async (id: string) => {
        const { data, error } = await supabase.from(getDb('PROVIDER')).select('*').eq('id', id);
        return data ? { data: data[0] } : { error };
      },
    }),
    /**
     * PUT/更新
     * @param {UpdateProviderParams} params
     * @return {CreateProviderResult}
     */
    updateProvider: builder.mutation({
      queryFn: async (params: UpdateProviderParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('PROVIDER'))
          .update({
            login_id: params.login_id,
            corporate_id: params.corporate_id,
            corporate_name: params.corporate_name,
            office_name: params.office_name,
            email: params.email,
            role: params.role,
          })
          .eq('id', params.id)
          .select();
        if (!data) return { error };
        return { data: data[0], error };
      },
    }),
  }),
});

export const {
  useGetProviderListQuery,
  useGetProviderListByCorporateIdQuery,
  useCreateProviderWithSignUpMutation,
  useLoginMutation,
  useGetProviderByIdQuery,
  useUpdateProviderMutation,
} = providerApi;
