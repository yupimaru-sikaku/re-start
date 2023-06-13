import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { userApi } from './query';
import { disabilityTypeList } from '@/utils/user';

export type User = {
  id: string;
  login_id: string; // 登録したログインユーザID
  corporate_id: string; // 登録した法人ID
  name: string; // 利用者の名前
  identification: string; // 受給者証番号
  gender: '男性' | '女性';
  is_gender_specification: boolean; // スタッフの性別指定å
  gender_specification: '男性' | '女性' | '無し' | ''; // スタッフの性別指定
  is_ido: boolean; // 移動支援を受けているか
  ido_amount: number; // 移動支援の契約支給量
  is_kodo: boolean; // 行動援護を受けているか
  kodo_amount: number; // 行動援護の契約支給量
  is_doko: boolean; // 同行援護を受けているか
  doko_amount: number; // 同行援護の契約支給量
  is_kazi: boolean; // 家事援助を受けているか
  kazi_amount: number; // 家事援助の契約支給量
  is_shintai: boolean; // 身体介護を受けているか
  shintai_amount: number; // 身体介護の契約支給量
  is_with_tsuin: boolean; // 通院等介助（伴う）を受けているか
  with_tsuin_amount: number; // 通院等介助（伴う）の契約支給量
  is_tsuin: boolean; // 通院等介助（伴わない）を受けているか
  tsuin_amount: number; // 通院等介助（伴わない）の契約支給量
  city: string; // サービスを受けている市区町村
  disability_type: (typeof disabilityTypeList)[number]; // 障害種別
  is_display: boolean; // 表示するか
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateUserParams = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type CreateUserResult = {
  error: PostgrestError | null;
};

export type UpdateUserParams = Omit<User, 'created_at' | 'updated_at'>;
export type UpdateUserResult = {
  error: PostgrestError | null;
};

export type ReturnUser = User;

export type DeleteUserResult = {
  error: PostgrestError | null;
};

export const createInitialState: CreateUserParams = {
  login_id: '',
  corporate_id: '',
  name: '',
  identification: '',
  gender: '男性' as '男性' | '女性',
  is_gender_specification: false,
  gender_specification: '' as '' | '男性' | '女性' | '無し',
  is_ido: false,
  ido_amount: 0,
  is_kodo: false,
  kodo_amount: 0,
  is_doko: false,
  doko_amount: 0,
  is_kazi: false,
  kazi_amount: 0,
  is_shintai: false,
  shintai_amount: 0,
  is_with_tsuin: false,
  with_tsuin_amount: 0,
  is_tsuin: false,
  tsuin_amount: 0,
  city: '',
  disability_type: '知的',
  is_display: true,
};

const initialState = {
  userData: {} as ReturnUser,
  userList: [] as ReturnUser[],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserList: (state, action: PayloadAction<ReturnUser[]>) => {
      state.userList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getUserList.matchFulfilled, (state, action: PayloadAction<ReturnUser[]>) => {
      state.userList = action.payload;
    });
    builder.addMatcher(
      userApi.endpoints.getUserListByCorporateId.matchFulfilled,
      (state, action: PayloadAction<ReturnUser[]>) => {
        state.userList = action.payload;
      }
    );
    builder.addMatcher(userApi.endpoints.getUserById.matchFulfilled, (state, action: PayloadAction<ReturnUser>) => {
      state.userData = action.payload;
    });
    builder.addMatcher(userApi.endpoints.getUserListByService.matchFulfilled, (state, action: PayloadAction<ReturnUser[]>) => {
      state.userList = action.payload;
    });
    builder.addMatcher(userApi.endpoints.createUser.matchFulfilled, (state, action: PayloadAction<ReturnUser>) => {
      state.userList = [action.payload, ...state.userList];
    });
    builder.addMatcher(userApi.endpoints.updateUser.matchFulfilled, (state, action: PayloadAction<ReturnUser>) => {
      state.userList = state.userList.map((user) => (user.id === action.payload.id ? action.payload : user));
      state.userData = action.payload;
    });
  },
});

export default userSlice;

export const { setUserList } = userSlice.actions;
