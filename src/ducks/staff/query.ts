import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  DeleteStaffResult,
  ReturnStaff,
  UpdateStaffParams,
  UpdateStaffResult,
} from './slice';
import { PostgrestError } from '@supabase/supabase-js';

export const staffApi = createApi({
  reducerPath: 'staffApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Staff'],
  endpoints: (builder) => ({
    /**
     * GET/全スタッフのリストを取得
     * @return {ReturnStaff[]}
     */
    getStaffList: builder.query<ReturnStaff[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from(getDb('STAFF'))
          .select('*')
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return data
          ? { data: data as ReturnStaff[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/スタッフの情報をidから取得
     * @param {string} id
     * @return {ReturnStaff}
     */
    getStaffById: builder.query<ReturnStaff, string>({
      queryFn: async (id: string) => {
        const { data, error } = await supabase
          .from(getDb('STAFF'))
          .select('*')
          .eq('id', id);
        return data ? { data: data[0] as ReturnStaff } : { error };
      },
    }),

    /**
     * PUT/スタッフの情報を更新
     * @params {ReturnStaff[]}
     * @return {ReturnStaff[]}
     */
    updateStaff: builder.mutation<UpdateStaffResult, UpdateStaffParams>({
      queryFn: async (params: UpdateStaffParams) => {
        const { error } = await supabase
          .from(getDb('STAFF'))
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
     * PUT/スタッフを論理削除
     * @param {string} id
     * @return {}
     */
    deleteStaff: builder.mutation<DeleteStaffResult, string>({
      queryFn: async (id: string) => {
        const { error } = await supabase
          .from(getDb('STAFF'))
          .update({ is_display: false })
          .eq('id', id);
        return { error };
      },
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
