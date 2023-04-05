export type User = {
  id?: string;
  name: string;
  identification: string;
  gender: '男性' | '女性';
  gender_specification: '男性' | '女性' | '無し' | '';
  is_ido: boolean;
  ido_amount: number;
  is_kodo: boolean;
  kodo_amount: number;
  is_doko: boolean;
  doko_amount: number;
  is_kazi: boolean;
  kazi_amount: number;
  is_shintai: boolean;
  shintai_amount: number;
  is_with_tsuin: boolean;
  with_tsuin_amount: number;
  is_tsuin: boolean;
  tsuin_amount: number;
  created_at?: string;
  updated_at: string;
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
