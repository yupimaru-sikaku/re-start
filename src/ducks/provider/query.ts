import { getDb, supabase } from '@/libs/supabase/supabase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { ReturnProvider } from 'src/ducks/provider/slice';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Provider'],
  endpoints: (builder) => ({
    /**
     * GET/idから情報を取得
     * @param {string} id
     * @return {ReturnProvider}
     */
    getProviderById: builder.query({
      queryFn: async (id: string) => {
        const { data, error } = await supabase
          .from(getDb('PROVIDER'))
          .select('*')
          .eq('id', id);
        return data ? { data } : { error };
      },
    }),
  }),
});

export const { useGetProviderByIdQuery } = providerApi;
