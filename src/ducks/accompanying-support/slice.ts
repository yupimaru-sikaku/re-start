type AccompanyingSupport = {
  id: string;
  year: number; // 作成する西暦
  month: number; // 作成する月
  name: string; // 利用者名
  identification: string; // 受給者証番号
  amount_title: string; // 契約支給量
  amount_value: number; // 契約支給量
  content_arr: {
    work_date: number; // サービス提供日
    service_content: string; // サービス内容
    start_time: string; // 開始時間
    end_time: string; // 終了時間
    staff_name: string; // スタッフ名
  }[];
  status: number; // 記録票の進捗状況
  user_id: string; // 作成した法人のID
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateAccompanyingSupport = Omit<
  AccompanyingSupport,
  | 'id'
  | 'year'
  | 'month'
  | 'amount_value'
  | 'content_arr'
  | 'created_at'
  | 'updated_at'
> & {
  year: number | null;
  month: number | null;
  amount_value: number | null;
  content_arr: {
    work_date: number | null;
    service_content: string;
    start_time: string | null;
    end_time: string | null;
    staff_name: string | null;
  }[];
};

export type ReturnAccompanyingSupport = Omit<
  AccompanyingSupport,
  'content_arr'
> & {
  content_arr: {
    work_date: number;
    service_content: string;
    start_time: string;
    end_time: string;
    staff_name: string | null;
  }[];
};

export type UpdateAccompanyingSupport = Omit<
  AccompanyingSupport,
  'content_arr' | 'created_at' | 'updated_at'
> & {
  content_arr: {
    work_date: number;
    service_content: string;
    start_time: string;
    end_time: string;
    staff_name: string | null;
  }[];
};

export const initialState: CreateAccompanyingSupport = {
  year: null,
  month: null,
  name: '',
  identification: '',
  amount_title: '',
  amount_value: null,
  content_arr: [
    {
      work_date: null,
      service_content: '',
      start_time: null,
      end_time: null,
      staff_name: null,
    },
  ],
  status: 0,
  user_id: '',
};
