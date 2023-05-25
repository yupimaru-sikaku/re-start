import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateHomeCareParams, DeleteHomeCareResult, UpdateHomeCareParams } from 'src/ducks/home-care/slice';

export const homeCareApi = createApi({
  reducerPath: 'homeCareApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['HomeCareApi'],
  endpoints: (builder) => ({
    /**
     * GET/全実績記録票のリストを取得
     * @param {}
     * @return {}
     */
    getHomeCareList: builder.query({
      queryFn: async (): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
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
    getHomeCareListByCorporateId: builder.query({
      queryFn: async (corporateId: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
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
    getHomeCareListByLoginId: builder.query({
      queryFn: async (loginId: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
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
    getHomeCareData: builder.query({
      queryFn: async (id: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .select('*')
          .eq('id', id)
          .order('updated_at', { ascending: false });
        if (!data) return { error };
        return { data: data[0], error };
      },
    }),
    /**
     * POST/実績記録票を作成
     * @param {CreateHomeCareParams} params
     * @return {}
     */
    createHomeCare: builder.mutation({
      queryFn: async (params: CreateHomeCareParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .insert({
            corporate_id: params.corporate_id,
            login_id: params.login_id,
            year: params.year,
            month: params.month,
            identification: params.identification,
            user_name: params.user_name,
            service_record_arr: params.service_record_arr,
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
     * @param {UpdateHomeCareParams} params
     * @return {}
     */
    updateHomeCare: builder.mutation({
      queryFn: async (params: UpdateHomeCareParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .update({
            corporate_id: params.corporate_id,
            login_id: params.login_id,
            year: params.year,
            month: params.month,
            identification: params.identification,
            user_name: params.user_name,
            service_record_arr: params.service_record_arr,
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
     * @return {DeleteHomeCareResult}
     */
    deleteHomeCare: builder.mutation<DeleteHomeCareResult, string>({
      queryFn: async (id: string): Promise<DeleteHomeCareResult> => {
        const { error } = await supabase.from(getDb('HOME_CARE')).update({ is_display: false }).eq('id', id);
        return { error };
      },
    }),
  }),
});

export const {
  useGetHomeCareListQuery,
  useGetHomeCareListByCorporateIdQuery,
  useGetHomeCareListByLoginIdQuery,
  useGetHomeCareDataQuery,
  useCreateHomeCareMutation,
  useUpdateHomeCareMutation,
  useDeleteHomeCareMutation,
} = homeCareApi;
