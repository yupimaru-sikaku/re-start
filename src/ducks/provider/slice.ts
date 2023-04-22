export type Provider = {
  id: string;
  user_id: string;
  corporate_id: string; // 法人ID
  corporate_name: string; // 法人名
  office_name: string; // 事業所名
  email: string; // メールアドレス
  role: 'user' | 'admin' | 'super_admin'; // 法人一般ユーザ | 法人管理者ユーザ ｜ アプリケーション管理者（リスタートのみ）
  password: string; // パスワード
  password_confirmation?: string; // パスワード（確認用）
};

export type ReturnProvider = Provider;

export const initialState: Provider = {
  id: '',
  user_id: '',
  corporate_id: '',
  corporate_name: '',
  office_name: '',
  email: '',
  role: 'user',
  password: '',
  password_confirmation: '',
};
