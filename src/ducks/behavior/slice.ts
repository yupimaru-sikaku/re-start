import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { behaviorApi } from './query';
import { ContentArr } from '../common-service/slice';

type Behavior = {
  id: string;
  login_id: string; // ログインユーザのID
  corporate_id: string; // 作成した法人のID
  year: number; // 作成する西暦
  month: number; // 作成する月
  user_name: string; // 利用者名
  amount_value: number; // 契約支給量
  identification: string; // 受給者証番号
  content_arr: ContentArr[];
  status: number; // 記録票の進捗状況
  is_display: boolean; // 表示するか
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateBehaviorParams = Omit<Behavior, 'id' | 'created_at' | 'updated_at'>;
export type CreateBehaviorResult = {
  error: PostgrestError | null;
};

export type UpdateBehaviorParams = Omit<Behavior, 'created_at' | 'updated_at'>;
export type UpdateBehaviorResult = {
  error: PostgrestError | null;
};

export type DeleteBehaviorResult = {
  error: PostgrestError | null;
};

export type ReturnBehavior = Behavior;

export const createInitialState: CreateBehaviorParams = {
  login_id: '',
  corporate_id: '',
  year: 0,
  month: 0,
  user_name: '',
  amount_value: 0,
  identification: '',
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
  behaviorData: {} as ReturnBehavior,
  behaviorList: [] as ReturnBehavior[],
};

const behaviorSlice = createSlice({
  name: 'behavior',
  initialState,
  reducers: {
    setBehaviorList: (state, action: PayloadAction<ReturnBehavior[]>) => {
      state.behaviorList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      behaviorApi.endpoints.getBehaviorList.matchFulfilled,
      (state, action: PayloadAction<ReturnBehavior[]>) => {
        state.behaviorList = action.payload;
      }
    );
    builder.addMatcher(
      behaviorApi.endpoints.getBehaviorListByCorporateId.matchFulfilled,
      (state, action: PayloadAction<ReturnBehavior[]>) => {
        state.behaviorList = action.payload;
      }
    );
    builder.addMatcher(
      behaviorApi.endpoints.getBehaviorListByLoginId.matchFulfilled,
      (state, action: PayloadAction<ReturnBehavior[]>) => {
        state.behaviorList = action.payload;
      }
    );
    builder.addMatcher(behaviorApi.endpoints.getBehaviorData.matchFulfilled, (state, action: PayloadAction<ReturnBehavior>) => {
      state.behaviorData = action.payload;
    });
    builder.addMatcher(behaviorApi.endpoints.createBehavior.matchFulfilled, (state, action: PayloadAction<ReturnBehavior>) => {
      state.behaviorList = [action.payload, ...state.behaviorList];
    });
    builder.addMatcher(behaviorApi.endpoints.updateBehavior.matchFulfilled, (state, action: PayloadAction<ReturnBehavior>) => {
      state.behaviorList = state.behaviorList.map((behavior) =>
        behavior.id === action.payload.id ? action.payload : behavior
      );
      state.behaviorData = action.payload;
    });
  },
});

export default behaviorSlice;

export const { setBehaviorList } = behaviorSlice.actions;
