import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { staffApi } from './query';

type Staff = {
  id: string;
  name: string; // 名前
  furigana: string; // ふりがな
  gender: '男性' | '女性'; // 性別
  work_time_per_week: number; // 勤務時間/週
  is_syoninsya: boolean; //初任者研修の資格
  is_kodo: boolean; //行動援護の資格
  is_doko_normal: boolean; //同行援護一般の資格
  is_doko_apply: boolean; //同行援護応用の資格
  is_zitsumusya: boolean; //介護福祉士の資格
  is_kaigo: boolean; //実務者研修の資格
  is_display: boolean; // 表示の有無
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
  user_id: string; // 作成した法人
};

export type CreateStaffParams = Omit<
  Staff,
  'id' | 'is_display' | 'created_at' | 'updated_at'
>;

export type CreateStaffResult = {
  error: PostgrestError | null;
};

export type UpdateStaffParams = Omit<
  Staff,
  'is_display' | 'created_at' | 'updated_at'
>;

export type ReturnStaff = Staff;

export type UpdateStaffResult = {
  error: PostgrestError | null;
};

export type DeleteStaffResult = {
  error: PostgrestError | null;
};

export const initialState = {
  id: '',
  staffList: [] as ReturnStaff[],
  name: '',
  furigana: '',
  gender: '男性' as Staff['gender'],
  work_time_per_week: 0,
  is_syoninsya: false,
  is_kodo: false,
  is_doko_normal: false,
  is_doko_apply: false,
  is_zitsumusya: false,
  is_kaigo: false,
  user_id: '',
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaffList: (state, action: PayloadAction<ReturnStaff[]>) => {
      state.staffList = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addMatcher(
  //     staffApi.endpoints.getStaffList.matchFulfilled,
  //     (state, action) => {
  //       console.log('Action payload:', action.payload);
  //       state.staffList = action.payload;
  //     }
  //   );
  // },
  // extraReducers: (builder) => {
  //   builder.addCase(getStaffList.fulfilled, (state, action) => {
  //     state.staffList = action.payload.staffList;
  //   })
  // },
});

export default staffSlice;

export const { setStaffList } = staffSlice.actions;
