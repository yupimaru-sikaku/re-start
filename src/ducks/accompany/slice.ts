import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { accompanyApi } from './query';

export type ContentArr = {
  work_date: number; // サービス提供日
  service_content: string; // サービス内容
  start_time: string; // 開始時間
  end_time: string; // 終了時間
  city: string; // 市区町村
  staff_name: string; // スタッフ名
};

type Accompany = {
  id: string;
  login_id: string; // ログインユーザのID
  corporate_id: string; // 作成した法人のID
  year: number; // 作成する西暦
  month: number; // 作成する月
  user_name: string; // 利用者名
  identification: string; // 受給者証番号
  content_arr: ContentArr[];
  status: number; // 記録票の進捗状況
  is_display: boolean; // 表示するか
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateAccompanyParams = Omit<Accompany, 'id' | 'created_at' | 'updated_at'>;
export type CreateAccompanyResult = {
  error: PostgrestError | null;
};

export type UpdateAccompanyParams = Omit<Accompany, 'created_at' | 'updated_at'>;
export type UpdateAccompanyResult = {
  error: PostgrestError | null;
};

export type DeleteAccompanyResult = {
  error: PostgrestError | null;
};

export type ReturnAccompany = Accompany;

export const createInitialState: CreateAccompanyParams = {
  login_id: '',
  corporate_id: '',
  year: 0,
  month: 0,
  identification: '',
  user_name: '',
  content_arr: [
    {
      work_date: 0,
      service_content: '',
      start_time: '',
      end_time: '',
      staff_name: '',
      city: '',
    },
  ],
  status: 0,
  is_display: false,
};

const initialState = {
  accompanyData: {} as ReturnAccompany,
  accompanyList: [] as ReturnAccompany[],
};

const accompanySlice = createSlice({
  name: 'accompany',
  initialState,
  reducers: {
    setAccompanyList: (state, action: PayloadAction<ReturnAccompany[]>) => {
      state.accompanyList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      accompanyApi.endpoints.getAccompanyList.matchFulfilled,
      (state, action: PayloadAction<ReturnAccompany[]>) => {
        state.accompanyList = action.payload;
      }
    );
    builder.addMatcher(
      accompanyApi.endpoints.getAccompanyListByCorporateId.matchFulfilled,
      (state, action: PayloadAction<ReturnAccompany[]>) => {
        state.accompanyList = action.payload;
      }
    );
    builder.addMatcher(
      accompanyApi.endpoints.getAccompanyListByLoginId.matchFulfilled,
      (state, action: PayloadAction<ReturnAccompany[]>) => {
        state.accompanyList = action.payload;
      }
    );
    builder.addMatcher(
      accompanyApi.endpoints.getAccompanyData.matchFulfilled,
      (state, action: PayloadAction<ReturnAccompany>) => {
        state.accompanyData = action.payload;
      }
    );
    builder.addMatcher(
      accompanyApi.endpoints.createAccompany.matchFulfilled,
      (state, action: PayloadAction<ReturnAccompany>) => {
        state.accompanyList = [action.payload, ...state.accompanyList];
      }
    );
  },
});

export default accompanySlice;

export const { setAccompanyList } = accompanySlice.actions;
