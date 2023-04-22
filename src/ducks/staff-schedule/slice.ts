export type StaffScheduleContentArr = {
  work_date: number; // サービス提供日
  service_content: string; // サービス内容
  user_name: string; // 利用者名
  start_time: string; // 開始時間
  end_time: string; // 終了時間
};

type StaffSchedule = {
  id: string;
  year: number; // 年
  month: number; // 月
  staff_name: string; // スタッフ名
  // work_time_amount: number; // 月の合計時間
  content_arr: StaffScheduleContentArr[];
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
};

export type CreateStaffSchedule = Omit<
  StaffSchedule,
  'id' | 'year' | 'month' | 'content_arr' | 'created_at' | 'updated_at'
> & {
  year: number | null;
  month: number | null;
  content_arr: {
    work_date: number | null;
    service_content: string;
    user_name: string;
    start_time: number | null;
    end_time: number | null;
  };
};

export type ReturnStaffSchedule = StaffSchedule;
