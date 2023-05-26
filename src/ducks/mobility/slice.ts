import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { mobilityApi } from './query';
import { ContentArr } from '../common-service/slice';

type Mobility = {
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

export type CreateMobilityParams = Omit<Mobility, 'id' | 'created_at' | 'updated_at'>;
export type CreateMobilityResult = {
  error: PostgrestError | null;
};

export type UpdateMobilityParams = Omit<Mobility, 'created_at' | 'updated_at'>;
export type UpdateMobilityResult = {
  error: PostgrestError | null;
};

export type DeleteMobilityResult = {
  error: PostgrestError | null;
};

export type ReturnMobility = Mobility;

export const createInitialState: CreateMobilityParams = {
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
  mobilityData: {} as ReturnMobility,
  mobilityList: [] as ReturnMobility[],
};

const mobilitySlice = createSlice({
  name: 'mobility',
  initialState,
  reducers: {
    setMobilityList: (state, action: PayloadAction<ReturnMobility[]>) => {
      state.mobilityList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      mobilityApi.endpoints.getMobilityList.matchFulfilled,
      (state, action: PayloadAction<ReturnMobility[]>) => {
        state.mobilityList = action.payload;
      }
    );
    builder.addMatcher(
      mobilityApi.endpoints.getMobilityListByCorporateId.matchFulfilled,
      (state, action: PayloadAction<ReturnMobility[]>) => {
        state.mobilityList = action.payload;
      }
    );
    builder.addMatcher(
      mobilityApi.endpoints.getMobilityListByLoginId.matchFulfilled,
      (state, action: PayloadAction<ReturnMobility[]>) => {
        state.mobilityList = action.payload;
      }
    );
    builder.addMatcher(mobilityApi.endpoints.getMobilityData.matchFulfilled, (state, action: PayloadAction<ReturnMobility>) => {
      state.mobilityData = action.payload;
    });
    builder.addMatcher(mobilityApi.endpoints.createMobility.matchFulfilled, (state, action: PayloadAction<ReturnMobility>) => {
      state.mobilityList = [action.payload, ...state.mobilityList];
    });
    builder.addMatcher(mobilityApi.endpoints.updateMobility.matchFulfilled, (state, action: PayloadAction<ReturnMobility>) => {
      state.mobilityList = state.mobilityList.map((mobility) =>
        mobility.id === action.payload.id ? action.payload : mobility
      );
      state.mobilityData = action.payload;
    });
  },
});

export default mobilitySlice;

export const { setMobilityList } = mobilitySlice.actions;
