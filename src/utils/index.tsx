import {
  CreateHomeCare,
  ReturnHomeCare,
} from '@/ducks/home-care/slice';

export const PAGE_SIZE = 5;

export const dokoColor = '#008000';
export const kodoColor = '#fd7e00';
export const idoColor = '#e6ca19';
export const kyotakuColor = '#0023ff';

// 法人IDを自動生成
export const generateRandomCorporateId = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const corporateIdLength = 7;

  let corporateId = '';
  for (let i = 0; i < corporateIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    corporateId += characters.charAt(randomIndex);
  }
  return corporateId;
};

// Supabaseから取得した日付（String）をフォーマット（String）
export const convertSupabaseTime = (supabaseTime: string): string => {
  const pad2 = (n: number) => {
    return n < 10 ? '0' + n : n;
  };
  const supabaseDate = new Date(supabaseTime);
  return (
    supabaseDate.getFullYear() +
    '-' +
    pad2(supabaseDate.getMonth() + 1) +
    '-' +
    pad2(supabaseDate.getDate()) +
    ' ' +
    pad2(supabaseDate.getHours()) +
    ':' +
    pad2(supabaseDate.getMinutes())
  );
};

// date.getDay()で取得した数字を曜日に変換
// Date型の日付をString型の曜日に変換
const weekItems = ['日', '月', '火', '水', '木', '金', '土'];
export const convertWeekItem = (
  year: number,
  month: number,
  day: number
): string => {
  if (day) {
    const targetDate = new Date(year, month - 1, day);
    return weekItems[targetDate.getDay()];
  } else {
    return '';
  }
};
// Date型の開始時間と終了時間から働いた時間をString型で返す
export const calcWorkTime = (
  start_time: string,
  end_time: string
): string => {
  if (!start_time || !end_time) return '0';
  const startTime = new Date(start_time);
  const endTime = new Date(end_time);
  const time = endTime.getTime() - startTime.getTime();
  return (time / 3600000).toFixed(1);
};

// Date型の日付をString型の時間（例15:00）に変換
export const convertTime = (date: string): string => {
  const convertDate = new Date(date);
  const hours = convertDate.getHours();
  const minutes = convertDate.getMinutes();
  const timeString = `${hours < 10 ? ' ' : ''}${hours}:${
    minutes < 10 ? '0' : ''
  }${minutes}`;
  return timeString;
};

// String型の開始時間と終了時間をそれぞれDate型で返す
export const convertStartEndTimeFromString2Date = (
  startTime: string,
  endTime: string
): [Date | null, Date | null] => {
  if (!startTime || !endTime) return [null, null];
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  return [startDate, endDate];
};

// サービスの種類を改行して表示
export const formatServiceContent = (
  serviceContent: string
): string => {
  if (serviceContent === '通院等介助（伴う）') {
    return '通院等介助\n    (伴う)';
  } else if (serviceContent === '通院等介助（伴わない）') {
    return '通院等介助\n (伴わない)';
  }
  return serviceContent;
};

// （居宅介護専用）記録票のオブジェクトから各サービスの合計算定時間を算出
export const calcEachWorkTime = (
  contentArr:
    | CreateHomeCare['content_arr']
    | ReturnHomeCare['content_arr']
) => {
  let kaziAmount = 0;
  let shintaiAmount = 0;
  let withTsuinAmount = 0;
  let tsuinAmount = 0;

  (contentArr || []).map((content) => {
    const workTime = Number(
      calcWorkTime(content.start_time!, content.end_time!)
    );

    switch (content.service_content) {
      case '家事援助':
        kaziAmount += workTime;
        break;
      case '身体介護':
        shintaiAmount += workTime;
        break;
      case '通院等介助（伴う）':
        withTsuinAmount += workTime;
        break;
      case '通院等介助（伴わない）':
        tsuinAmount += workTime;
        break;
    }
  });
  return {
    kaziAmount: kaziAmount.toString(),
    shintaiAmount: shintaiAmount.toString(),
    withTsuinAmount: withTsuinAmount.toString(),
    tsuinAmount: tsuinAmount.toString(),
  };
};
