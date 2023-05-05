import { PostgrestError } from '@supabase/supabase-js';

export type HomeCareSupportContentArr = {
  work_date: number; // サービス提供日
  service_content: string; // サービス内容
  start_time: string; // 開始時間
  end_time: string; // 終了時間
  staff_name: string; // スタッフ名
};

type HomeCareSupport = {
  id: string;
  year: number; // 作成する西暦
  month: number; // 作成する月
  identification: string; // 受給者証番号
  name: string; // 利用者名
  amount_title_1: string; // 契約支給量
  amount_value_1: number; // 契約支給量
  amount_title_2: string; // 契約支給量
  amount_value_2: number; // 契約支給量
  amount_title_3: string; // 契約支給量
  amount_value_3: number; // 契約支給量
  content_arr: HomeCareSupportContentArr[];
  status: number; // 記録票の進捗状況
  corporate_id: string; // 作成した法人のID
  login_id: string; // ログインユーザのID
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateHomeCareSupport = Omit<
  HomeCareSupport,
  | 'id'
  | 'year'
  | 'month'
  | 'amount_value_1'
  | 'amount_title_2'
  | 'amount_value_2'
  | 'amount_title_3'
  | 'amount_value_3'
  | 'content_arr'
  | 'created_at'
  | 'updated_at'
> & {
  year: number | null;
  month: number | null;
  amount_value_1: number | null;
  amount_title_2: string | null;
  amount_value_2: number | null;
  amount_title_3: string | null;
  amount_value_3: number | null;
  content_arr: {
    work_date: number | null;
    service_content: string;
    start_time: string | null;
    end_time: string | null;
    staff_name: string | null;
  }[];
};

export type ReturnHomeCareSupport = Omit<
  HomeCareSupport,
  | 'amount_title_2'
  | 'amount_value_2'
  | 'amount_title_3'
  | 'amount_value_3'
  | 'content_arr'
> & {
  amount_title_2: string | null;
  amount_value_2: number | null;
  amount_title_3: string | null;
  amount_value_3: number | null;
  content_arr: {
    work_date: number;
    service_content: string;
    start_time: string;
    end_time: string;
    staff_name: string | null;
  }[];
};

export type UpdateHomeCareSupportParams = Omit<
  HomeCareSupport,
  | 'amount_title_2'
  | 'amount_value_2'
  | 'amount_title_3'
  | 'amount_value_3'
  | 'content_arr'
  | 'created_at'
  | 'updated_at'
> & {
  amount_title_2: string | null;
  amount_value_2: number | null;
  amount_title_3: string | null;
  amount_value_3: number | null;
  content_arr: {
    work_date: number;
    service_content: string;
    start_time: string;
    end_time: string;
    staff_name: string | null;
  }[];
};

export type UpdateHomeCareSupportResult = {
  error: PostgrestError | null;
};

export type DeleteHomeCareSupportResult = {
  error: PostgrestError | null;
};

export const initialState = {
  year: 0,
  month: 0,
  name: '',
  identification: '',
  amount_title_1: '',
  amount_value_1: 0,
  amount_title_2: '',
  amount_value_2: 0,
  amount_title_3: '',
  amount_value_3: 0,
  content_arr: [
    {
      work_date: 0,
      service_content: '',
      start_time: '',
      end_time: '',
      staff_name: '',
    },
  ],
  status: 0,
  corporate_id: '',
};
