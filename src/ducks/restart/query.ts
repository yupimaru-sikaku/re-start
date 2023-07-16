import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { DeleteRestartResult, UpdateRestartParams } from './slice';
import { CreateRestartParams } from './slice';

export const restartApi = createApi({
  reducerPath: 'restartApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['RestartApi'],
  endpoints: (builder) => ({
    /**
     * GET/全実績記録票のリストを取得
     * @param {}
     * @return {}
     */
    getRestartList: builder.query({
      queryFn: async (): Promise<any> => {
        const { data, error } = await supabase.from(getDb('RESTART')).select('*').order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/IDに該当する実績記録票を取得
     * @param {string} id
     * @return {}
     */
    getRestartData: builder.query({
      queryFn: async (id: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('RESTART'))
          .select('*')
          .eq('id', id)
          .order('updated_at', { ascending: false });
        if (!data) return { error };
        return { data: data[0], error };
      },
    }),
    /**
     * POST/実績記録票を作成
     * @param {CreateRestartParams} params
     * @return {}
     */
    createRestart: builder.mutation({
      queryFn: async (params: CreateRestartParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('RESTART'))
          .insert({
            user_name: params.user_name,
            staff_name: params.staff_name,
            year: params.year,
            month: params.month,
            day: params.day,
            service_content: params.service_content,
            comment: params.comment,
          })
          .select();
        if (!error && data[0]) return { data: data[0] };
        return { error };
      },
    }),
  }),
});

export const { useGetRestartListQuery, useGetRestartDataQuery, useCreateRestartMutation } = restartApi;
