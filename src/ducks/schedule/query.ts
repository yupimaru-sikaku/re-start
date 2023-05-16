import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostgrestError } from '@supabase/supabase-js';
import {
  CreateScheduleParams,
  CreateScheduleResult,
  GetScheduleParams,
  ReturnSchedule,
  UpdateScheduleParams,
  UpdateScheduleResult,
} from './slice';

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Schedule'],
  endpoints: (builder) => ({
    /**
     * GET/全てのスケジュールリストを取得
     * @param {}
     * @return {ReturnSchedule[]}
     */
    getScheduleList: builder.query<ReturnSchedule[], void>({
      queryFn: async (): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('SCHEDULE'))
          .select('*');
        return { data, error };
      },
    }),
    /**
     * GET/任意の年月とスタッフからスケジュールを取得
     * @param {GetScheduleParams} params
     * @return {ReturnSchedule}
     */
    getSchedule: builder.query<ReturnSchedule, GetScheduleParams>({
      queryFn: async (params: GetScheduleParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('SCHEDULE'))
          .select('*')
          .eq('year', params.year)
          .eq('month', params.month)
          .eq('staff_id', params.staff_id);
        if (!data) return { error };
        return { data: data[0], error };
      },
    }),
    /**
     * POST/スケジュールを作成
     * @param {CreateScheduleParams} params
     * @return {CreateScheduleResult}
     */
    createSchedule: builder.mutation<
      CreateScheduleResult,
      CreateScheduleParams
    >({
      queryFn: async (
        params: CreateScheduleParams
      ): Promise<CreateScheduleResult> => {
        const { error } = await supabase.from(getDb('SCHEDULE')).insert({
          staff_id: params.staff_id,
          staff_name: params.staff_name,
          year: params.year,
          month: params.month,
          content_arr: params.content_arr,
        });
        return { error };
      },
      invalidatesTags: [
        { type: 'Schedule', id: 'getSchedule' },
        { type: 'Schedule', id: 'getScheduleList' },
      ],
    }),
    /**
     * PUP/スケジュールを更新
     * @param {UpdateScheduleParams} params
     * @return {UpdateScheduleResult}
     */
    updateSchedule: builder.mutation({
      queryFn: async (
        params: UpdateScheduleParams
      ): Promise<UpdateScheduleResult> => {
        const { error } = await supabase
          .from(getDb('SCHEDULE'))
          .update({
            staff_name: params.staff_name,
            staff_id: params.staff_id,
            year: params.year,
            month: params.month,
            content_arr: params.content_arr,
          })
          .eq('id', params.id);
        return { error };
      },
      invalidatesTags: [
        { type: 'Schedule', id: 'getSchedule' },
        { type: 'Schedule', id: 'getScheduleList' },
      ],
    }),
  }),
});

export const {
  useGetScheduleListQuery,
  useGetScheduleQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} = scheduleApi;
