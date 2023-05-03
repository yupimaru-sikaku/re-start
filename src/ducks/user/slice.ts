import { PostgrestError } from '@supabase/supabase-js';

export type User = {
  id: string;
  name: string; // 利用者の名前
  identification: string; // 受給者証番号
  gender: '男性' | '女性';
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
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateUserParams = Omit<
  User,
  'id' | 'is_display' | 'created_at' | 'updated_at'
>;

export type UpdateUserParams = Omit<
  User,
  'is_display' | 'created_at' | 'updated_at'
>;

export type ReturnUser = User;

export type UpdateUserResult = {
  error: PostgrestError | null;
};

export type DeleteUserResult = {
  error: PostgrestError | null;
};

export const initialState: User = {
  id: '',
  name: '',
  identification: '',
  gender: '男性',
  gender_specification: '',
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
  created_at: '',
  updated_at: '',
};
