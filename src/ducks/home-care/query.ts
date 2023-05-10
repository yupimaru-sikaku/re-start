import { getDb, supabase } from '@/libs/supabase/supabase';
import {
  createApi,
  fakeBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { PostgrestError } from '@supabase/supabase-js';
import {
  DeleteHomeCareResult,
  ReturnHomeCare,
  UpdateHomeCareParams,
  UpdateHomeCareResult,
} from './slice';

export const homeCareApi = createApi({
  reducerPath: 'homeCareApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['HomeCare'],
  endpoints: (builder) => ({
    /**
     * GET/全実績記録票のリストを取得
     * @param {}
     * @return {ReturnUser[]}
     */
    getHomeCareList: builder.query<ReturnHomeCare[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .select('*')
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return data
          ? { data: data as ReturnHomeCare[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/法人IDに属する実績記録票のリストを取得
     * @param {string} corporateId
     * @return {ReturnUser[]}
     */
    getHomeCareListByCoroprateId: builder.query<
      ReturnHomeCare[],
      string
    >({
      queryFn: async (corporateId: string) => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .select('*')
          .eq('is_display', true)
          .eq('corporate_id', corporateId)
          .order('updated_at', { ascending: false });
        return data
          ? { data: data as ReturnHomeCare[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/ログインユーザに属する実績記録票のリストを取得
     * @param {string} loginUserId
     * @return {ReturnUser[]}
     */
    getHomeCareListByLoginId: builder.query<ReturnHomeCare[], string>(
      {
        queryFn: async (loginUserId: string) => {
          const { data, error } = await supabase
            .from(getDb('HOME_CARE'))
            .select('*')
            .eq('is_display', true)
            .eq('user_id', loginUserId)
            .order('updated_at', { ascending: false });
          return data
            ? { data: data as ReturnHomeCare[] }
            : { error: error as PostgrestError };
        },
      }
    ),
    /**
     * GET/実績記録票の情報をidから取得
     * @param {string} id
     * @return {ReturnHomeCare}
     */
    getHomeCareById: builder.query<ReturnHomeCare, string>({
      queryFn: async (id: string) => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .select('*')
          .eq('id', id);
        return data ? { data: data[0] as ReturnHomeCare } : { error };
      },
    }),
    /**
     * PUT/実績記録票の情報を更新
     * @param {UpdateHomeCareParams[]} params
     * @return {UpdateHomeCareResult[]}
     */
    updateHomeCare: builder.mutation<
      UpdateHomeCareResult,
      UpdateHomeCareParams
    >({
      queryFn: async (params: UpdateHomeCareParams) => {
        const { error } = await supabase
          .from(getDb('HOME_CARE'))
          .update({})
          .eq('id', params.id);
        return { error };
      },
    }),
    /**
     * PUT/ユーザを論理削除
     * @param {string} id
     * @return {DeleteHomeCareResult}
     */
    deleteHomeCare: builder.mutation<DeleteHomeCareResult, string>({
      queryFn: async (id: string) => {
        const { error } = await supabase
          .from(getDb('HOME_CARE'))
          .update({ is_display: false })
          .eq('id', id);
        return { error };
      },
    }),
  }),
});

export const {
  useGetHomeCareListQuery,
  useGetHomeCareListByCoroprateIdQuery,
  useGetHomeCareListByLoginIdQuery,
  useGetHomeCareByIdQuery,
  useUpdateHomeCareMutation,
  useDeleteHomeCareMutation,
} = homeCareApi;
