import { createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';

export type MobilityContentArr = {
  work_date: number; // サービス提供日
  service_content: string; // サービス内容
  start_time: string; // 開始時間
  end_time: string; // 終了時間
  staff_name: string; // スタッフ名
};

type Mobility = {
  id: string;
  corporate_id: string; // 作成した法人のID
  login_id: string; // ログインユーザのID
  year: number; // 作成する西暦
  month: number; // 作成する月
  identification: string; // 受給者証番号
  name: string; // 利用者名
  content_arr: MobilityContentArr[];
  status: number; // 記録票の進捗状況
  is_display: boolean; // 表示するか
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateMobilityParams = Omit<
  Mobility,
  'id' | 'is_display' | 'created_at' | 'updated_at'
>;
export type CreateMobilityResult = {
  error: PostgrestError | null;
};
export type UpdateMobilityParams = Omit<
  Mobility,
  'is_display' | 'created_at' | 'updated_at'
>;
export type UpdateMobilityResult = {
  error: PostgrestError | null;
};

export type DeleteMobilityResult = {
  error: PostgrestError | null;
};

export type ReturnMobility = Mobility;

export const createInitialState: CreateMobilityParams = {
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
    },
  ],
  status: 0,
  corporate_id: '',
  login_id: '',
};

const initialState = {};

export const MobilitySlice = createSlice({
  name: 'Mobility',
  initialState,
  reducers: {},
});

export default MobilitySlice;
