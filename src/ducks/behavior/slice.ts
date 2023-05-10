import { createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { ContentArr } from '../accompany/slice';

type Behavior = {
  id: string;
  corporate_id: string; // 作成した法人のID
  login_id: string; // ログインユーザのID
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

export type CreateBehaviorParams = Omit<
  Behavior,
  'id' | 'is_display' | 'created_at' | 'updated_at'
>;
export type CreateBehaviorResult = {
  error: PostgrestError | null;
};
export type UpdateBehaviorParams = Omit<
  Behavior,
  'is_display' | 'created_at' | 'updated_at'
>;
export type UpdateBehaviorResult = {
  error: PostgrestError | null;
};

export type DeleteBehaviorResult = {
  error: PostgrestError | null;
};

export type ReturnBehavior = Behavior;

export const createInitialState: CreateBehaviorParams = {
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
  corporate_id: '',
  login_id: '',
};

const initialState = {};

export const BehaviorSlice = createSlice({
  name: 'Behavior',
  initialState,
  reducers: {},
});

export default BehaviorSlice;
