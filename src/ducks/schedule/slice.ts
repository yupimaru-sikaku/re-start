import { createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';

export type ScheduleContentArr = {
  work_date: number; // サービス提供日
  service_content: string; // サービス内容
  start_time: string; // 開始時間
  end_time: string; // 終了時間
  city: string; // 市区町村
  user_name: string; // 利用者名
};

type Schedule = {
  id: string;
  staff_id: string; // スタッフID
  year: number; // 年
  month: number; // 月
  staff_name: string; // スタッフ名
  content_arr: ScheduleContentArr[];
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type GetScheduleParams = Pick<
  Schedule,
  'staff_id' | 'year' | 'month'
>;

export type CreateScheduleParams = Omit<
  Schedule,
  'id' | 'created_at' | 'updated_at'
>;
export type CreateScheduleResult = {
  error: PostgrestError | null;
};

export type UpdateScheduleParams = Omit<
  Schedule,
  'created_at' | 'updated_at'
>;
export type UpdateScheduleResult = {
  error: PostgrestError | null;
};

export type ReturnSchedule = Schedule;

export const createInitialState: CreateScheduleParams = {
  staff_id: '',
  year: 0,
  month: 0,
  staff_name: '',
  content_arr: [
    {
      work_date: 0,
      service_content: '',
      start_time: '',
      end_time: '',
      user_name: '',
      city: '',
    },
  ],
};

const initialState = {};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default scheduleSlice;