import { useLoginUser } from '@/libs/mantine/useLoginUser';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostgrestError } from '@supabase/supabase-js';
import { DeleteUserResult, ReturnUser, UpdateUserResult } from './slice';
import { UpdateStaffParams } from '../staff/slice';

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
    getStaffById: builder.query<ReturnUser, string>({
      queryFn: async (id: string) => {
        const { data, error } = await supabase
          .from(getDb('USER'))
          .select('*')
          .eq('id', id);
        return data ? { data: data[0] as ReturnUser } : { error };
      },
    }),

    /**
     * PUT/スタッフの情報を更新
     * @param {UpdateStaffParams[]} params
     * @return {ReturnUser[]}
     */
    updateStaff: builder.mutation<UpdateUserResult, UpdateStaffParams>({
      queryFn: async (params: UpdateStaffParams) => {
        const { error } = await supabase
          .from(getDb('USER'))
          .update({
            name: params.name,
            furigana: params.furigana,
            gender: params.gender,
            work_time_per_week: params.work_time_per_week,
            is_syoninsya: params.is_syoninsya,
            is_kodo: params.is_kodo,
            is_doko_normal: params.is_doko_normal,
            is_doko_apply: params.is_doko_apply,
            is_zitsumusya: params.is_zitsumusya,
            is_kaigo: params.is_kaigo,
            user_id: params.user_id,
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
  useGetUserListByLoginIdQuery,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteUserMutation,
} = userApi;
