import {
  CreateHomeCareSupport,
  ReturnHomeCareSupport,
} from '@/ducks/home-care-support/slice';

export const PAGE_SIZE = 5;

// アカウントIDを自動生成
export const generateRandomAccountId = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const accountIdLength = 7;
  let accountId = '';

  for (let i = 0; i < accountIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    accountId += characters.charAt(randomIndex);
  }

  return accountId;
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
export const weekItems = ['日', '月', '火', '水', '木', '金', '土'];
// Date型の日付をString型の曜日に変換
export const convertWeekItem = (date: Date): string => {
  return weekItems[date.getDay()];
};

// Date型の開始時間と終了時間からString型で働いた時間を算出
export const calcWorkTime = (
  start_time: Date | null,
  end_time: Date | null
): string => {
  if (!start_time || !end_time) return '0';

  const time = end_time.getTime() - start_time.getTime();
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

// サービスの種類を改行して表示
export const formatServiceContent = (serviceContent: string): string => {
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
    | CreateHomeCareSupport['content_arr']
    | ReturnHomeCareSupport['content_arr']
) => {
  let kaziAmount = 0;
  let shintaiAmount = 0;
  let withTsuinAmount = 0;
  let tsuinAmount = 0;

  (contentArr || []).map((content) => {
    const workTime = Number(
      calcWorkTime(new Date(content.start_time!), new Date(content.end_time!))
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
