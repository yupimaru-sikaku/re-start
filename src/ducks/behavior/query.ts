import { getDb, supabase } from '@/libs/supabase/supabase';
import {
  createApi,
  fakeBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  DeleteBehaviorResult,
  ReturnBehavior,
  UpdateBehaviorParams,
  UpdateBehaviorResult,
} from './slice';
import { CreateBehaviorParams } from './slice';
import { CreateBehaviorResult } from './slice';

export const behaviorApi = createApi({
  reducerPath: 'BehaviorApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['BehaviorApi'],
  endpoints: (builder) => ({
    /**
     * GET/全実績記録票のリストを取得
     * @param {}
     * @return {ReturnBehavior[][]}
     */
    getBehaviorList: builder.query<ReturnBehavior[], void>({
      queryFn: async (): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('MOBILITY'))
          .select('*')
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/法人IDに属する実績記録票のリストを取得
     * @param {string} corporateId
     * @return {ReturnBehavior[][]}
     */
    getBehaviorListByCorporateId: builder.query<
      ReturnBehavior[],
      string
    >({
      queryFn: async (corporateId: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('MOBILITY'))
          .select('*')
          .eq('corporate_id', corporateId)
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/ログインIDに属する実績記録票のリストを取得
     * @param {string} loginId
     * @return {ReturnBehavior[]}
     */
    getBehaviorListByLoginId: builder.query<ReturnBehavior[], string>(
      {
        queryFn: async (loginId: string): Promise<any> => {
          const { data, error } = await supabase
            .from(getDb('MOBILITY'))
            .select('*')
            .eq('login_id', loginId)
            .order('updated_at', { ascending: false });
          return { data, error };
        },
      }
    ),
    /**
     * GET/IDに該当する実績記録票を取得
     * @param {string} id
     * @return {ReturnBehavior}
     */
    getBehaviorData: builder.query<ReturnBehavior, string>({
      queryFn: async (id: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('MOBILITY'))
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
     * @return {CreateBehaviorResult}
     */
    createBehavior: builder.mutation({
      queryFn: async (
        params: CreateBehaviorParams
      ): Promise<CreateBehaviorResult> => {
        const { error } = await supabase
          .from(getDb('MOBILITY'))
          .insert({
            corporate_id: params.corporate_id,
            login_id: params.login_id,
            year: params.year,
            month: params.month,
            identification: params.identification,
            name: params.name,
            content_arr: params.content_arr,
            status: params.status,
          });
        return { error };
      },
    }),
    /**
     * PUT/IDの該当する実績記録票を更新
     * @param {UpdateBehaviorParams} params
     * @return {UpdateBehaviorResult}
     */
    updateBehavior: builder.mutation({
      queryFn: async (
        params: UpdateBehaviorParams
      ): Promise<UpdateBehaviorResult> => {
        const { error } = await supabase
          .from(getDb('MOBILITY'))
          .update({
            corporate_id: params.corporate_id,
            login_id: params.login_id,
            year: params.year,
            month: params.month,
            identification: params.identification,
            name: params.name,
            content_arr: params.content_arr,
            status: params.status,
          })
          .eq('id', params.id);
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
        const { error } = await supabase
          .from(getDb('MOBILITY'))
          .update({ is_display: false })
          .eq('id', id);
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
