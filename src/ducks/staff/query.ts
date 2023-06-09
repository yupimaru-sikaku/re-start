import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreateStaffParams,
  CreateStaffResult,
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
     * @param {}
     * @return {ReturnStaff[]}
     */
    getStaffList: builder.query<ReturnStaff[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from(getDb('STAFF'))
          .select('*')
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return data ? { data: data as ReturnStaff[] } : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/サービスに属するスタッフのリストを取得
     * @param {string} serviceName
     * @return {ReturnStaff[]}
     */
    getStaffListByService: builder.query<ReturnStaff[], string>({
      queryFn: async (serviceName: string) => {
        let query = supabase.from(getDb('STAFF')).select('*');

        switch (serviceName) {
          case 'kodo':
            query = query.eq('is_kodo', true);
            break;
          case 'doko':
            query = query.or('is_doko_normal.eq.true,is_doko_apply.eq.true');
            break;
          case 'ido':
          case 'kyotaku':
            query = query.or('is_syoninsya.eq.true,is_zitsumusya.eq.true,is_kaigo.eq.true');
            break;
          default:
            throw new Error('Invalid service name');
        }
        const { data, error } = await query.order('updated_at', {
          ascending: false,
        });
        return data ? { data: data as ReturnStaff[] } : { error: error as PostgrestError };
      },
    }),
    /**
    /**
     * GET/スタッフの情報をidから取得
     * @param {string} id
     * @return {ReturnStaff}
     */
    getStaffById: builder.query<ReturnStaff, string>({
      queryFn: async (id: string) => {
        const { data, error } = await supabase.from(getDb('STAFF')).select('*').eq('id', id);
        return data ? { data: data[0] as ReturnStaff } : { error };
      },
    }),
    /**
     * POST/スタッフの情報を作成
     * @param {CreateStaffParams} params
     * @return {CreateStaffResult}
     */
    createStaff: builder.mutation({
      queryFn: async (params: CreateStaffParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('STAFF'))
          .insert({
            login_id: params.login_id,
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
          })
          .select();
        if (!error && data[0]) return { data: data[0] };
        return { error };
      },
    }),
    /**
     * PUT/スタッフの情報を更新
     * @param {ReturnStaff[]} params
     * @return {ReturnStaff[]}
     */
    updateStaff: builder.mutation({
      queryFn: async (params: UpdateStaffParams): Promise<any> => {
        const { data, error } = await supabase
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
            login_id: params.login_id,
          })
          .eq('id', params.id)
          .select();
        if (!error && data[0]) return { data: data[0] };
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
        const { error } = await supabase.from(getDb('STAFF')).update({ is_display: false }).eq('id', id);
        return { error };
      },
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useGetStaffListByServiceQuery,
  useGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
