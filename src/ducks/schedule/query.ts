import { getDb, supabase } from '@/libs/supabase/supabase';
import {
  createApi,
  fakeBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { PostgrestError } from '@supabase/supabase-js';
import {
  CreateScheduleParams,
  CreateScheduleResult,
  GetScheduleParams,
  ReturnSchedule,
} from './slice';

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Schedule'],
  endpoints: (builder) => ({
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
      queryFn: async (params: CreateScheduleParams): Promise<any> => {
        const { error } = await supabase
          .from(getDb('SCHEDULE'))
          .insert({
            staff_id: params.staff_id,
            year: params.year,
            month: params.month,
            content_arr: params.content_arr,
          });
        return { error };
      },
    }),
  }),
});

export const { useGetScheduleQuery, useCreateScheduleMutation } =
  scheduleApi;
