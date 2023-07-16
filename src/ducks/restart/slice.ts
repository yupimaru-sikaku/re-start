import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { restartApi } from './query';

type Restart = {
  id: string;
  user_name: string; // 利用者名
  staff_name: string; // スタッフ名
  year: number; // 作成する西暦
  month: number; // 作成する月
  day: number; // 作成する日付
  start_time: string;
  end_time: string;
  service_content:
    | '移動支援'
    | '行動援護'
    | '同行援護'
    | '居宅介護_家事援助'
    | '居宅介護_身体介護'
    | '居宅介護_通院等介助（伴う）'
    | '居宅介護_通院等介助（伴わない）'
    | '';
  check_list: number[];
  comment: string;
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateRestartParams = Omit<Restart, 'id' | 'created_at' | 'updated_at'>;
export type CreateRestartResult = {
  error: PostgrestError | null;
};

export type UpdateRestartParams = Omit<Restart, 'created_at' | 'updated_at'>;
export type UpdateRestartResult = {
  error: PostgrestError | null;
};

export type DeleteRestartResult = {
  error: PostgrestError | null;
};

export type ReturnRestart = Restart;

export const createInitialState: CreateRestartParams = {
  user_name: '',
  staff_name: '',
  year: 0,
  month: 0,
  day: 0,
  start_time: '',
  end_time: '',
  service_content: '',
  check_list: [],
  comment: '',
};

const initialState = {
  restartData: {} as ReturnRestart,
  restartList: [] as ReturnRestart[],
};

const restartSlice = createSlice({
  name: 'restart',
  initialState,
  reducers: {
    setRestartList: (state, action: PayloadAction<ReturnRestart[]>) => {
      state.restartList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(restartApi.endpoints.getRestartList.matchFulfilled, (state, action: PayloadAction<ReturnRestart[]>) => {
      state.restartList = action.payload;
    });
    builder.addMatcher(restartApi.endpoints.getRestartData.matchFulfilled, (state, action: PayloadAction<ReturnRestart>) => {
      state.restartData = action.payload;
    });
    builder.addMatcher(restartApi.endpoints.createRestart.matchFulfilled, (state, action: PayloadAction<ReturnRestart>) => {
      state.restartList = [action.payload, ...state.restartList];
    });
  },
});

export default restartSlice;

export const { setRestartList } = restartSlice.actions;
