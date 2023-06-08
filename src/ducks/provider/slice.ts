import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthResponse, PostgrestError } from '@supabase/supabase-js';
import { providerApi } from './query';

export type Provider = {
  id: string;
  user_id: string; // 属するログインID
  corporate_id: string; // 法人ID
  corporate_name: string; // 法人名
  office_name: string; // 事業所名
  email: string; // メールアドレス
  role: 'office' | 'corporate' | 'admin'; // 法人一般ユーザ | 法人管理者ユーザ ｜ アプリケーション管理者（リスタートのみ）
  is_display: boolean; // 表示するか
  password: string;
  password_confirmation: string;
  created_at: string;
  updated_at: string;
};

export type LoginProviderInfoType = Pick<Provider, 'id' | 'corporate_id' | 'corporate_name' | 'office_name' | 'email' | 'role'>;

type initialStateType = {
  loginProviderInfo: LoginProviderInfoType;
  providerList: ReturnProvider[];
};

export type CreateProviderParams = Omit<Provider, 'id' | 'is_display' | 'created_at' | 'updated_at'>;
export type CreateProviderWithSignUpParams = Pick<Provider, 'email' | 'password' | 'password_confirmation'>;
export type CreateProviderWithSignUpResult = AuthResponse;

export type LoginParams = Pick<Provider, 'email' | 'password'>;
export type LoginResult = any;

export type ReturnProvider = Omit<Provider, 'password' | 'password_confirmation'>;

export type UpdateProviderParams = Omit<
  Provider,
  'is_display' | 'password' | 'password_confirmation' | 'created_at' | 'updated_at'
>;
export type UpdateProviderResult = {
  error: PostgrestError | null;
};

export const createInitialState = {
  user_id: '',
  corporate_id: '',
  corporate_name: '',
  office_name: '',
  email: '',
  role: 'corporate' as Provider['role'],
  password: '',
  password_confirmation: '',
};

export const loginInitialState = {
  email: '',
  password: '',
};

export const initialState: initialStateType = {
  loginProviderInfo: {
    id: '',
    corporate_id: '',
    corporate_name: '',
    office_name: '',
    email: '',
    role: 'corporate',
  },
  providerList: [],
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    clearLoginProviderInfo: (state) => {
      state.loginProviderInfo = initialState.loginProviderInfo;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(providerApi.endpoints.login.matchFulfilled, (state, action: PayloadAction<ReturnProvider>) => {
      state.loginProviderInfo.id = action.payload.id;
      state.loginProviderInfo.email = action.payload.email;
      state.loginProviderInfo.corporate_id = action.payload.corporate_id;
      state.loginProviderInfo.corporate_name = action.payload.corporate_name;
      state.loginProviderInfo.office_name = action.payload.office_name;
      state.loginProviderInfo.role = action.payload.role;
    });
    builder.addMatcher(
      providerApi.endpoints.getProviderList.matchFulfilled,
      (state, action: PayloadAction<ReturnProvider[]>) => {
        state.providerList = action.payload;
      }
    );
    builder.addMatcher(
      providerApi.endpoints.getProviderListByCorporateId.matchFulfilled,
      (state, action: PayloadAction<ReturnProvider[]>) => {
        state.providerList = action.payload;
      }
    );
    builder.addMatcher(
      providerApi.endpoints.createProviderWithSignUp.matchFulfilled,
      (state, action: PayloadAction<ReturnProvider>) => {
        state.providerList = [action.payload, ...state.providerList];
      }
    );
    builder.addMatcher(providerApi.endpoints.updateProvider.matchFulfilled, (state, action: PayloadAction<ReturnProvider>) => {
      state.providerList = state.providerList.map((provider) =>
        provider.id === action.payload.id ? action.payload : provider
      );
    });
  },
});

export default providerSlice;

export const { clearLoginProviderInfo } = providerSlice.actions;
