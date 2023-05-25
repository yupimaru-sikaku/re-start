import { PostgrestError } from '@supabase/supabase-js';
import { ContentArr } from '../common-service/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { homeCareApi } from './query';

type ServiceRecordArr = {
  amount_title: string; // 契約サービス名
  amount_value: number; // 契約支給量
};

type HomeCare = {
  id: string;
  login_id: string; // ログインユーザのID
  corporate_id: string; // 作成した法人のID
  year: number; // 作成する西暦
  month: number; // 作成する月
  user_name: string; // 利用者名
  service_record_arr: ServiceRecordArr[];
  identification: string; // 受給者証番号
  content_arr: ContentArr[];
  status: number; // 記録票の進捗状況
  is_display: boolean; // 表示するか
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateHomeCareParams = Omit<HomeCare, 'id' | 'created_at' | 'updated_at'>;
export type CreateHomeCareResult = {
  error: PostgrestError | null;
};

export type UpdateHomeCareParams = Omit<HomeCare, 'created_at' | 'updated_at'>;
export type UpdateHomeCareResult = {
  error: PostgrestError | null;
};

export type DeleteHomeCareResult = {
  error: PostgrestError | null;
};

export type ReturnHomeCare = HomeCare;

export const createInitialState: CreateHomeCareParams = {
  login_id: '',
  corporate_id: '',
  year: 0,
  month: 0,
  identification: '',
  user_name: '',
  service_record_arr: [{ amount_title: '', amount_value: 0 }],
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
  homeCareData: {} as ReturnHomeCare,
  homeCareList: [] as ReturnHomeCare[],
};

const homeCareSlice = createSlice({
  name: 'homeCare',
  initialState,
  reducers: {
    setHomeCareList: (state, action: PayloadAction<ReturnHomeCare[]>) => {
      state.homeCareList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      homeCareApi.endpoints.getHomeCareList.matchFulfilled,
      (state, action: PayloadAction<ReturnHomeCare[]>) => {
        state.homeCareList = action.payload;
      }
    );
    builder.addMatcher(
      homeCareApi.endpoints.getHomeCareListByCorporateId.matchFulfilled,
      (state, action: PayloadAction<ReturnHomeCare[]>) => {
        state.homeCareList = action.payload;
      }
    );
    builder.addMatcher(
      homeCareApi.endpoints.getHomeCareListByLoginId.matchFulfilled,
      (state, action: PayloadAction<ReturnHomeCare[]>) => {
        state.homeCareList = action.payload;
      }
    );
    builder.addMatcher(homeCareApi.endpoints.getHomeCareData.matchFulfilled, (state, action: PayloadAction<ReturnHomeCare>) => {
      state.homeCareData = action.payload;
    });
    builder.addMatcher(homeCareApi.endpoints.createHomeCare.matchFulfilled, (state, action: PayloadAction<ReturnHomeCare>) => {
      state.homeCareList = [action.payload, ...state.homeCareList];
    });
    builder.addMatcher(homeCareApi.endpoints.updateHomeCare.matchFulfilled, (state, action: PayloadAction<ReturnHomeCare>) => {
      state.homeCareList = state.homeCareList.map((homeCare) =>
        homeCare.id === action.payload.id ? action.payload : homeCare
      );
      state.homeCareData = action.payload;
    });
  },
});

export default homeCareSlice;

export const { setHomeCareList } = homeCareSlice.actions;
