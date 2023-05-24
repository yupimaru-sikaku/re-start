import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { DeleteAccompanyResult, UpdateAccompanyParams } from './slice';
import { CreateAccompanyParams } from './slice';

export const accompanyApi = createApi({
  reducerPath: 'accompanyApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['AccompanyApi'],
  endpoints: (builder) => ({
    /**
     * GET/全実績記録票のリストを取得
     * @param {}
     * @return {}
     */
    getAccompanyList: builder.query({
      queryFn: async (): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('ACCOMPANY'))
          .select('*')
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/法人IDに属する実績記録票のリストを取得
     * @param {string} corporateId
     * @return {}
     */
    getAccompanyListByCorporateId: builder.query({
      queryFn: async (corporateId: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('ACCOMPANY'))
          .select('*')
          .eq('corporate_id', corporateId)
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/ログインIDに属する実績記録票のリストを取得
     * @param {string} loginId
     * @return {}
     */
    getAccompanyListByLoginId: builder.query({
      queryFn: async (loginId: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('ACCOMPANY'))
          .select('*')
          .eq('login_id', loginId)
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/IDに該当する実績記録票を取得
     * @param {string} id
     * @return {}
     */
    getAccompanyData: builder.query({
      queryFn: async (id: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('ACCOMPANY'))
          .select('*')
          .eq('id', id)
          .order('updated_at', { ascending: false });
        if (!data) return { error };
        return { data: data[0], error };
      },
    }),
    /**
     * POST/実績記録票を作成
     * @param {CreateAccompanyParams} params
     * @return {}
     */
    createAccompany: builder.mutation({
      queryFn: async (params: CreateAccompanyParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('ACCOMPANY'))
          .insert({
            corporate_id: params.corporate_id,
            login_id: params.login_id,
            year: params.year,
            month: params.month,
            identification: params.identification,
            user_name: params.user_name,
            content_arr: params.content_arr,
            status: params.status,
          })
          .select();
        if (!error && data[0]) return { data: data[0] };
        return { error };
      },
    }),
    /**
     * PUT/IDの該当する実績記録票を更新
     * @param {UpdateAccompanyParams} params
     * @return {}
     */
    updateAccompany: builder.mutation({
      queryFn: async (params: UpdateAccompanyParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('ACCOMPANY'))
          .update({
            corporate_id: params.corporate_id,
            login_id: params.login_id,
            year: params.year,
            month: params.month,
            identification: params.identification,
            user_name: params.user_name,
            content_arr: params.content_arr,
            status: params.status,
          })
          .eq('id', params.id)
          .select();
        if (!error && data[0]) return { data: data[0] };
        return { error };
      },
    }),
    /**
     * PUT/IDに実績記録票を理論削除
     * @param {string} id
     * @return {DeleteAccompanyResult}
     */
    deleteAccompany: builder.mutation<DeleteAccompanyResult, string>({
      queryFn: async (id: string): Promise<DeleteAccompanyResult> => {
        const { error } = await supabase.from(getDb('ACCOMPANY')).update({ is_display: false }).eq('id', id);
        return { error };
      },
    }),
  }),
});

export const {
  useGetAccompanyListQuery,
  useGetAccompanyListByCorporateIdQuery,
  useGetAccompanyListByLoginIdQuery,
  useGetAccompanyDataQuery,
  useCreateAccompanyMutation,
  useUpdateAccompanyMutation,
  useDeleteAccompanyMutation,
} = accompanyApi;
