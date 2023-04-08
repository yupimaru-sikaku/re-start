type Staff = {
  id: string;
  name: string; // 名前
  furigana: string; // ふりがな
  gender: string; // 性別
  work_time_per_week: number; // 勤務時間/週
  is_syoninsya: boolean; //初任者研修の資格
  is_kodo: boolean; //行動援護の資格
  is_doko_normal: boolean; //同行援護一般の資格
  is_doko_apply: boolean; //同行援護応用の資格
  is_zitsumusya: boolean; //介護福祉士の資格
  is_kaigo: boolean; //実務者研修の資格
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
  user_id: string; // 作成した法人
};

export type CreateStaff = Omit<
  Staff,
  'id' | 'work_time_per_week' | 'created_at' | 'updated_at'
> & {
  work_time_per_week: number | null;
};

export type ReturnStaff = Staff;

export const initialState: CreateStaff = {
  name: '',
  furigana: '',
  gender: '',
  work_time_per_week: null,
  is_syoninsya: false,
  is_kodo: false,
  is_doko_normal: false,
  is_doko_apply: false,
  is_zitsumusya: false,
  is_kaigo: false,
  user_id: '',
};
