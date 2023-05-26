import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostgrestError } from '@supabase/supabase-js';
import { CreateUserParams, CreateUserResult, DeleteUserResult, ReturnUser, UpdateUserParams, UpdateUserResult } from './slice';

type ServiceType = 'is_doko' | 'is_kodo' | 'is_ido' | 'is_kyotaku';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    /**
     * GET/全利用者のリストを取得
     * @param {}
     * @return {ReturnUser[]}
     */
    getUserList: builder.query<ReturnUser[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from(getDb('USER'))
          .select('*')
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return data ? { data: data as ReturnUser[] } : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/法人IDに属する全利用者のリストを取得
     * @param {string} corporateId
     * @return {ReturnUser[]}
     */
    getUserListByCorporateId: builder.query({
      queryFn: async (corporateId: string): Promise<any> => {
        if (!corporateId) return { data: [] };
        const { data, error } = await supabase
          .from(getDb('USER'))
          .select('*')
          .eq('is_display', true)
          .eq('corporate_id', corporateId)
          .order('updated_at', { ascending: false });
        return data ? { data: data as ReturnUser[] } : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/サービスに属する利用者のリストを取得
     * @param {string} corporateId
     * @return {ReturnUser[]}
     */
    getUserListByService: builder.query({
      queryFn: async ({ corporateId, serviceName }: { corporateId: string; serviceName: ServiceType }): Promise<any> => {
        let data, error;
        if (serviceName === 'is_kyotaku') {
          ({ data, error } = await supabase
            .from(getDb('USER'))
            .select('*')
            .eq('corporate_id', corporateId)
            .or(`is_kazi.eq.true,is_shintai.eq.true,is_tsuin.eq.true,is_with_tsuin.eq.true`)
            .order('updated_at', { ascending: false }));
        } else {
          ({ data, error } = await supabase
            .from(getDb('USER'))
            .select('*')
            .eq('corporate_id', corporateId)
            .eq(serviceName, true)
            .order('updated_at', { ascending: false }));
        }

        return data ? { data: data as ReturnUser[] } : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/ログインユーザに属する全利用者のリストを取得
     * @param {string} loginId
     * @return {ReturnUser[]}
     */
    getUserListByLoginId: builder.query({
      queryFn: async (loginId: string) => {
        if (!loginId) return { data: [] };
        const { data, error } = await supabase
          .from(getDb('USER'))
          .select('*')
          .eq('is_display', true)
          .eq('login_id', loginId)
          .order('updated_at', { ascending: false });
        return data ? { data: data as ReturnUser[] } : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/スタッフの情報をidから取得
     * @param {string} id
     * @return {ReturnUser}
     */
    getUserById: builder.query({
      queryFn: async (id: string): Promise<any> => {
        const { data, error } = await supabase.from(getDb('USER')).select('*').eq('id', id);
        return data ? { data: data[0] as ReturnUser } : { error };
      },
    }),
    /**
     * POST/スタッフの情報を作成
     * @param {CreateUserParams} params
     * @return {CreateUserParams}
     */
    createUser: builder.mutation({
      queryFn: async (params: CreateUserParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('USER'))
          .insert({
            login_id: params.login_id,
            corporate_id: params.corporate_id,
            name: params.name,
            identification: params.identification,
            gender: params.gender,
            is_gender_specification: params.is_gender_specification,
            gender_specification: params.gender_specification,
            ido_amount: params.ido_amount,
            is_ido: params.is_ido,
            kodo_amount: params.kodo_amount,
            is_kodo: params.is_kodo,
            doko_amount: params.doko_amount,
            is_doko: params.is_doko,
            is_kazi: params.is_kazi,
            kazi_amount: params.kazi_amount,
            is_shintai: params.is_shintai,
            shintai_amount: params.shintai_amount,
            is_with_tsuin: params.is_with_tsuin,
            with_tsuin_amount: params.with_tsuin_amount,
            is_tsuin: params.is_tsuin,
            tsuin_amount: params.tsuin_amount,
            city: params.city,
            disability_type: params.disability_type,
          })
          .select();
        if (!error && data[0]) return { data: data[0] };
        return { error };
      },
    }),
    /**
     * PUT/スタッフの情報を更新
     * @param {UpdateUserParams} params
     * @return {ReturnUser[]}
     */
    updateUser: builder.mutation({
      queryFn: async (params: UpdateUserParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('USER'))
          .update({
            login_id: params.login_id,
            corporate_id: params.corporate_id,
            name: params.name,
            identification: params.identification,
            gender: params.gender,
            is_gender_specification: params.is_gender_specification,
            gender_specification: params.gender_specification,
            ido_amount: params.ido_amount,
            is_ido: params.is_ido,
            kodo_amount: params.kodo_amount,
            is_kodo: params.is_kodo,
            doko_amount: params.doko_amount,
            is_doko: params.is_doko,
            is_kazi: params.is_kazi,
            kazi_amount: params.kazi_amount,
            is_shintai: params.is_shintai,
            shintai_amount: params.shintai_amount,
            is_with_tsuin: params.is_with_tsuin,
            with_tsuin_amount: params.with_tsuin_amount,
            is_tsuin: params.is_tsuin,
            tsuin_amount: params.tsuin_amount,
            city: params.city,
            disability_type: params.disability_type,
          })
          .eq('id', params.id)
          .select();
        if (!error && data[0]) return { data: data[0] };
        return { error };
      },
    }),
    /**
     * PUT/ユーザを論理削除
     * @param {string} id
     * @return {DeleteUserResult}
     */
    deleteUser: builder.mutation<DeleteUserResult, string>({
      queryFn: async (id: string) => {
        const { error } = await supabase.from(getDb('USER')).update({ is_display: false }).eq('id', id);
        return { error };
      },
    }),
  }),
});

export const {
  useGetUserListQuery,
  useGetUserListByCorporateIdQuery,
  useGetUserListByServiceQuery,
  useGetUserListByLoginIdQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
