import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostgrestError } from '@supabase/supabase-js';
import {
  CreateUserParams,
  CreateUserResult,
  DeleteUserResult,
  ReturnUser,
  UpdateUserParams,
  UpdateUserResult,
} from './slice';

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
        return data
          ? { data: data as ReturnUser[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/法人IDに属する全利用者のリストを取得
     * @param {string} corporateId
     * @return {ReturnUser[]}
     */
    getUserListByCorporateId: builder.query<ReturnUser[], string>({
      queryFn: async (corporateId: string) => {
        if (!corporateId) return { data: [] };
        const { data, error } = await supabase
          .from(getDb('USER'))
          .select('*')
          .eq('is_display', true)
          .eq('corporate_id', corporateId)
          .order('updated_at', { ascending: false });
        return data
          ? { data: data as ReturnUser[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/サービスに属する利用者のリストを取得
     * @param {string} serviceName
     * @return {ReturnUser[]}
     */
    getUserListByService: builder.query<ReturnUser[], string>({
      queryFn: async (serviceName: string) => {
        const { data, error } = await supabase
          .from(getDb('USER'))
          .select('*')
          .eq(serviceName, true)
          .order('updated_at', { ascending: false });
        return data
          ? { data: data as ReturnUser[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/ログインユーザに属する全利用者のリストを取得
     * @param {string} loginUserId
     * @return {ReturnUser[]}
     */
    getUserListByLoginId: builder.query<ReturnUser[], string>({
      queryFn: async (loginUserId: string) => {
        if (!loginUserId) return { data: [] };
        const { data, error } = await supabase
          .from(getDb('USER'))
          .select('*')
          .eq('is_display', true)
          .eq('user_id', loginUserId)
          .order('updated_at', { ascending: false });
        return data
          ? { data: data as ReturnUser[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/スタッフの情報をidから取得
     * @param {string} id
     * @return {ReturnUser}
     */
    getUserById: builder.query<ReturnUser, string>({
      queryFn: async (id: string) => {
        const { data, error } = await supabase
          .from(getDb('USER'))
          .select('*')
          .eq('id', id);
        return data ? { data: data[0] as ReturnUser } : { error };
      },
    }),
    /**
     * POST/スタッフの情報を作成
     * @param {CreateUserParams} params
     * @return {CreateUserParams}
     */
    createUser: builder.mutation<CreateUserResult, CreateUserParams>({
      queryFn: async (params: CreateUserParams) => {
        const { error } = await supabase.from(getDb('USER')).insert({
          user_id: params.user_id,
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
        });
        return { error };
      },
    }),
    /**
     * PUT/スタッフの情報を更新
     * @param {UpdateUserParams} params
     * @return {ReturnUser[]}
     */
    updateUser: builder.mutation<UpdateUserResult, UpdateUserParams>({
      queryFn: async (params: UpdateUserParams) => {
        const { error } = await supabase
          .from(getDb('USER'))
          .update({
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
          })
          .eq('id', params.id);
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
        const { error } = await supabase
          .from(getDb('USER'))
          .update({ is_display: false })
          .eq('id', id);
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
