import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostgrestError } from '@supabase/supabase-js';
import {
  DeleteHomeCareSupportResult,
  ReturnHomeCareSupport,
  UpdateHomeCareSupportParams,
  UpdateHomeCareSupportResult,
} from './slice';

export const homeCareSupportApi = createApi({
  reducerPath: 'homeCareSupportApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['HomeCareSupportApi'],
  endpoints: (builder) => ({
    /**
     * GET/全実績記録票のリストを取得
     * @param {}
     * @return {ReturnUser[]}
     */
    getHomeCareSupportList: builder.query<ReturnHomeCareSupport[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .select('*')
          .eq('is_display', true)
          .order('updated_at', { ascending: false });
        return data
          ? { data: data as ReturnHomeCareSupport[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/法人IDに属する実績記録票のリストを取得
     * @param {string} corporateId
     * @return {ReturnUser[]}
     */
    getHomeCareSupportListByCoroprateId: builder.query<
      ReturnHomeCareSupport[],
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
          ? { data: data as ReturnHomeCareSupport[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/ログインユーザに属する実績記録票のリストを取得
     * @param {string} loginUserId
     * @return {ReturnUser[]}
     */
    getHomeCareSupportListByLoginId: builder.query<
      ReturnHomeCareSupport[],
      string
    >({
      queryFn: async (loginUserId: string) => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .select('*')
          .eq('is_display', true)
          .eq('user_id', loginUserId)
          .order('updated_at', { ascending: false });
        return data
          ? { data: data as ReturnHomeCareSupport[] }
          : { error: error as PostgrestError };
      },
    }),
    /**
     * GET/実績記録票の情報をidから取得
     * @param {string} id
     * @return {ReturnHomeCareSupport}
     */
    getHomeCareSupportById: builder.query<ReturnHomeCareSupport, string>({
      queryFn: async (id: string) => {
        const { data, error } = await supabase
          .from(getDb('HOME_CARE'))
          .select('*')
          .eq('id', id);
        return data ? { data: data[0] as ReturnHomeCareSupport } : { error };
      },
    }),
    /**
     * PUT/実績記録票の情報を更新
     * @param {UpdateHomeCareSupportParams[]} params
     * @return {UpdateHomeCareSupportResult[]}
     */
    updateHomeCareSupport: builder.mutation<
      UpdateHomeCareSupportResult,
      UpdateHomeCareSupportParams
    >({
      queryFn: async (params: UpdateHomeCareSupportParams) => {
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
     * @return {DeleteHomeCareSupportResult}
     */
    deleteHomeCareSupport: builder.mutation<
      DeleteHomeCareSupportResult,
      string
    >({
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
  useGetHomeCareSupportListQuery,
  useGetHomeCareSupportListByCoroprateIdQuery,
  useGetHomeCareSupportListByLoginIdQuery,
  useGetHomeCareSupportByIdQuery,
  useUpdateHomeCareSupportMutation,
  useDeleteHomeCareSupportMutation,
} = homeCareSupportApi;
