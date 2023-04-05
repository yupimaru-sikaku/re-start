type HomeCareSupport = {
  id: string;
  year: number;
  month: number;
  name: string;
  identification: string;
  amount_title_1: string;
  amount_value_1: number;
  amount_title_2: string;
  amount_value_2: number;
  amount_title_3: string;
  amount_value_3: number;
  content_arr: {
    work_date: number;
    service_content: string;
    start_time: string;
    end_time: string;
    staff_name: string;
  }[];
  status: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
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
  created_at: string;
  updated_at: string;
};

export type UpdateHomeCareSupport = Omit<
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

export const initialState: CreateHomeCareSupport = {
  year: null,
  month: null,
  name: '',
  identification: '',
  amount_title_1: '',
  amount_value_1: null,
  amount_title_2: '',
  amount_value_2: null,
  amount_title_3: '',
  amount_value_3: null,
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
