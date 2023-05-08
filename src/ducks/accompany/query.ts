import { getDb, supabase } from '@/libs/supabase/supabase';
import {
  createApi,
  fakeBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  DeleteAccompanyResult,
  ReturnAccompany,
  UpdateAccompanyParams,
  UpdateAccompanyResult,
} from './slice';
import { CreateAccompanyParams } from './slice';
import { CreateAccompanyResult } from './slice';

export const accompanyApi = createApi({
  reducerPath: 'AccompanyApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['AccompanyApi'],
  endpoints: (builder) => ({
    /**
     * GET/全実績記録票のリストを取得
     * @param {}
     * @return {ReturnAccompany[][]}
     */
    getAccompanyList: builder.query<ReturnAccompany[], void>({
      queryFn: async (): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('ACCOMPANY'))
          .select('*')
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/法人IDに属する実績記録票のリストを取得
     * @param {string} corporateId
     * @return {ReturnAccompany[][]}
     */
    getAccompanyListByCorporateId: builder.query<
      ReturnAccompany[],
      string
    >({
      queryFn: async (corporateId: string): Promise<any> => {
        const { data, error } = await supabase
          .from(getDb('ACCOMPANY'))
          .select('*')
          .eq('corporate_id', corporateId)
          .order('updated_at', { ascending: false });
        return { data, error };
      },
    }),
    /**
     * GET/ログインIDに属する実績記録票のリストを取得
     * @param {string} loginId
     * @return {ReturnAccompany[]}
     */
    getAccompanyListByLoginId: builder.query<ReturnAccompany[], string>(
      {
        queryFn: async (loginId: string): Promise<any> => {
          const { data, error } = await supabase
            .from(getDb('ACCOMPANY'))
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
     * @return {ReturnAccompany}
     */
    getAccompanyData: builder.query<ReturnAccompany, string>({
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
     * @return {CreateAccompanyResult}
     */
    createAccompany: builder.mutation({
      queryFn: async (
        params: CreateAccompanyParams
      ): Promise<CreateAccompanyResult> => {
        const { error } = await supabase
          .from(getDb('ACCOMPANY'))
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
     * @param {UpdateAccompanyParams} params
     * @return {UpdateAccompanyResult}
     */
    updateAccompany: builder.mutation({
      queryFn: async (
        params: UpdateAccompanyParams
      ): Promise<UpdateAccompanyResult> => {
        const { error } = await supabase
          .from(getDb('ACCOMPANY'))
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
     * @return {DeleteAccompanyResult}
     */
    deleteAccompany: builder.mutation<DeleteAccompanyResult, string>({
      queryFn: async (id: string): Promise<DeleteAccompanyResult> => {
        const { error } = await supabase
          .from(getDb('ACCOMPANY'))
          .update({ is_display: false })
          .eq('id', id);
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
