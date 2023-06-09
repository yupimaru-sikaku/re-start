import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { DeleteBehaviorResult, UpdateBehaviorParams } from './slice';
import { CreateBehaviorParams } from './slice';

export const behaviorApi = createApi({
  reducerPath: 'behaviorApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['BehaviorApi'],
  endpoints: (builder) => ({
    /**
     * GET/全実績記録票のリストを取得
     * @param {}
     * @return {}
     */
    getBehaviorList: builder.query({
      queryFn: async (): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('BEHAVIOR'))
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
    getBehaviorListByCorporateId: builder.query({
      queryFn: async (corporateId: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('BEHAVIOR'))
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
    getBehaviorListByLoginId: builder.query({
      queryFn: async (loginId: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('BEHAVIOR'))
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
    getBehaviorData: builder.query({
      queryFn: async (id: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('BEHAVIOR'))
          .select('*')
          .eq('id', id)
          .order('updated_at', { ascending: false });
        if (!data) return { error };
        return { data: data[0], error };
      },
    }),
    /**
     * POST/実績記録票を作成
     * @param {CreateBehaviorParams} params
     * @return {}
     */
    createBehavior: builder.mutation({
      queryFn: async (params: CreateBehaviorParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('BEHAVIOR'))
          .insert({
            corporate_id: params.corporate_id,
            login_id: params.login_id,
            year: params.year,
            month: params.month,
            user_name: params.user_name,
            amount_value: params.amount_value,
            identification: params.identification,
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
     * @param {UpdateBehaviorParams} params
     * @return {}
     */
    updateBehavior: builder.mutation({
      queryFn: async (params: UpdateBehaviorParams): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('BEHAVIOR'))
          .update({
            corporate_id: params.corporate_id,
            login_id: params.login_id,
            year: params.year,
            month: params.month,
            user_name: params.user_name,
            amount_value: params.amount_value,
            identification: params.identification,
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
     * @return {DeleteBehaviorResult}
     */
    deleteBehavior: builder.mutation<DeleteBehaviorResult, string>({
      queryFn: async (id: string): Promise<DeleteBehaviorResult> => {
        const { error } = await supabase.from(getDb('BEHAVIOR')).update({ is_display: false }).eq('id', id);
        return { error };
      },
    }),
  }),
});

export const {
  useGetBehaviorListQuery,
  useGetBehaviorListByCorporateIdQuery,
  useGetBehaviorListByLoginIdQuery,
  useGetBehaviorDataQuery,
  useCreateBehaviorMutation,
  useUpdateBehaviorMutation,
  useDeleteBehaviorMutation,
} = behaviorApi;
