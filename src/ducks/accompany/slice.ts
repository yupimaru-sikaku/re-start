import { createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';

export type ContentArr = {
  work_date: number; // サービス提供日
  service_content: string; // サービス内容
  start_time: string; // 開始時間
  end_time: string; // 終了時間
  staff_name: string; // スタッフ名
  city: string; // 市区町村
};

type Accompany = {
  id: string;
  login_id: string; // ログインユーザのID
  corporate_id: string; // 作成した法人のID
  year: number; // 作成する西暦
  month: number; // 作成する月
  name: string; // 利用者名
  identification: string; // 受給者証番号
  content_arr: ContentArr[];
  status: number; // 記録票の進捗状況
  is_display: boolean; // 表示するか
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateAccompanyParams = Omit<
  Accompany,
  'id' | 'created_at' | 'updated_at'
>;
export type CreateAccompanyResult = {
  error: PostgrestError | null;
};

export type UpdateAccompanyParams = Omit<
  Accompany,
  'created_at' | 'updated_at'
>;
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
  name: '',
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

const initialState = {};

const accompanySlice = createSlice({
  name: 'accompnay',
  initialState,
  reducers: {},
  extraReducers: {},
});

export default accompanySlice;
