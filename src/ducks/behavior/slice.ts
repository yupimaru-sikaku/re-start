import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { behaviorApi } from './query';
import { ContentArr } from '../accompany/slice';

type Behavior = {
  id: string;
  corporate_id: string; // 作成した法人のID
  login_id: string; // ログインユーザのID
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

export type CreateBehaviorParams = Omit<Behavior, 'id' | 'is_display' | 'created_at' | 'updated_at'>;
export type CreateBehaviorResult = {
  error: PostgrestError | null;
};
export type UpdateBehaviorParams = Omit<Behavior, 'is_display' | 'created_at' | 'updated_at'>;
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
  corporate_id: '',
  login_id: '',
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
