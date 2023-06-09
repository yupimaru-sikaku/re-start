import { ReturnAccompany } from '@/ducks/accompany/slice';
import { ReturnBehavior } from '@/ducks/behavior/slice';
import { ContentArr } from '@/ducks/common-service/slice';
import { ReturnMobility } from '@/ducks/mobility/slice';
import { ReturnSchedule } from '@/ducks/schedule/slice';
import { ReturnStaff } from '@/ducks/staff/slice';
import { ReturnUser, User } from '@/ducks/user/slice';
import { UseFormReturnType } from '@mantine/form';

export const PAGE_SIZE = 10;
export const monthList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
export const yearList = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027'];

export const TOP = 'トップページ';
export const DOKO = '同行援護';
export const KODO = '行動援護';
export const IDO = '移動支援';
export const KYOTAKU = '居宅介護';
export const KAZI = '家事援助';
export const SHINTAI = '身体介護';
export const TSUIN = '通院等介助（伴わない）';
export const WITH_TSUIN = '通院等介助（伴う）';

export const dokoColor = '#008000';
export const kodoColor = '#fd7e00';
export const idoColor = '#e6ca19';
export const kyotakuColor = '#0023ff';

// 法人IDを自動生成
export const generateRandomCorporateId = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
export const convertWeekItem = (year: number, month: number, day: number): string => {
  if (day) {
    const targetDate = new Date(year, month - 1, day);
    return weekItems[targetDate.getDay()];
  } else {
    return '';
  }
};
// string型の開始時間と終了時間から働いた時間をString型で返す
export const calcWorkTime = (start_time: string, end_time: string): string => {
  if (!start_time || !end_time) return '0';
  const startTime = new Date(start_time);
  const endTime = new Date(end_time);
  const time = endTime.getTime() - startTime.getTime();
  return (time / 3600000).toFixed(1);
};

// 実績記録票のcontent_arrから合計勤務時間を算出
export const calcAllWorkTime = (content_arr: ContentArr[]) =>
  content_arr.reduce((sum: number, content: ContentArr) => {
    if (content.start_time === '' || content.end_time === '') {
      return sum;
    }
    return sum + Number(calcWorkTime(content.start_time, content.end_time));
  }, 0);

// Date型の日付をString型の時間（例15:00）に変換
export const convertTime = (date: string): string => {
  const convertDate = new Date(date);
  const hours = convertDate.getHours();
  const minutes = convertDate.getMinutes();
  const timeString = `${hours < 10 ? ' ' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  return timeString;
};

// String型の開始時間と終了時間をそれぞれDate型で返す
export const convertStartEndTimeFromString2Date = (startTime: string, endTime: string): [Date | null, Date | null] => {
  if (!startTime || !endTime) return [null, null];
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  return [startDate, endDate];
};

// サービスの種類を改行して表示
export const formatServiceContent = (serviceContent: string): string => {
  if (serviceContent === WITH_TSUIN) {
    return '通院等介助\n    (伴う)';
  } else if (serviceContent === TSUIN) {
    return '通院等介助\n (伴わない)';
  }
  return serviceContent;
};

// （居宅介護専用）記録票のオブジェクトから各サービスの合計算定時間を算出
export const calcEachWorkTime = (contentArr: ContentArr[]) => {
  let kaziAmountTime = 0;
  let shintaiAmountTime = 0;
  let withTsuinAmountTime = 0;
  let tsuinAmountTime = 0;

  contentArr.map((content) => {
    const workTime = Number(calcWorkTime(content.start_time!, content.end_time!));

    switch (content.service_content) {
      case KAZI:
        kaziAmountTime += workTime;
        break;
      case SHINTAI:
        shintaiAmountTime += workTime;
        break;
      case WITH_TSUIN:
        withTsuinAmountTime += workTime;
        break;
      case TSUIN:
        tsuinAmountTime += workTime;
        break;
    }
  });
  return {
    kaziAmountTime,
    shintaiAmountTime,
    withTsuinAmountTime,
    tsuinAmountTime,
  };
};

// 任意の年月で、記録票に既に存在してる場合はリストから除外
export const excludingSelected = (
  userList: ReturnUser[],
  recordList: ReturnAccompany[] | ReturnBehavior[] | ReturnMobility[],
  form: UseFormReturnType<any>
): { value: string; disabled: boolean }[] => {
  return userList.map((user) => {
    const isDisabled = recordList.some((record) => {
      return (
        // 等価演算子になっていることに注意
        record.year == form.values.year && record.month == form.values.month && record.user_name === user.name
      );
    });
    return {
      value: user.name,
      disabled: isDisabled,
    };
  });
};

// 任意の年月、任意のスタッフのスケジュールから各週の勤務時間の配列を取得する
export const splitByWeeks = (schedule: ReturnSchedule | undefined, year: number, month: number): number[] => {
  if (!schedule) return [];
  const weeksInMonth = [];
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);

  let weekStartDate = new Date(firstDate);
  weekStartDate.setDate(firstDate.getDate() - firstDate.getDay());

  while (weekStartDate <= lastDate) {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    if (weekEndDate > lastDate) {
      weekEndDate.setDate(lastDate.getDate());
    }
    const weekEndDateEndOfDay = new Date(weekEndDate);
    weekEndDateEndOfDay.setHours(23, 59, 59, 999);

    const weekEvents = schedule?.content_arr.filter((event) => {
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);

      return (
        (startDate >= weekStartDate && startDate < weekEndDateEndOfDay) ||
        (endDate > weekStartDate && endDate <= weekEndDateEndOfDay) ||
        (startDate < weekStartDate && endDate > weekEndDateEndOfDay)
      );
    });

    weeksInMonth.push(weekEvents);

    weekStartDate = new Date(weekEndDate);
    weekStartDate.setDate(weekEndDate.getDate() + 1);
    weekStartDate.setHours(0, 0, 0, 0);
  }

  const timePerWeekList = weeksInMonth.map((content) => {
    return content.reduce((total, x) => total + Number(calcWorkTime(x.start_time, x.end_time)), 0);
  });

  return timePerWeekList;
};

// 任意のスタッフがサービスを提供できる資格があるか判断
// TODO:要リファクタリング
export const isQualifiedToProvideService = (
  staff: ReturnStaff,
  type: typeof DOKO | typeof KODO | typeof IDO | typeof KYOTAKU,
  user?: User
): boolean => {
  if (!user) return false;
  switch (type) {
    case DOKO:
      if (user.gender_specification) {
        return staff.gender === user.gender_specification && (staff.is_doko_normal || staff.is_doko_apply);
      } else {
        return staff.is_doko_normal || staff.is_doko_apply;
      }
    case KODO:
      if (user.gender_specification) {
        return staff.gender === user.gender_specification && staff.is_kodo;
      } else {
        return staff.is_kodo;
      }
    case IDO:
      if (
        user.is_gender_specification &&
        user.city === '枚方市' &&
        (user.disability_type === '精神' ||
          user.disability_type === '精神・身体' ||
          user.disability_type === '知的・精神' ||
          user.disability_type === '知的・精神・身体')
      ) {
        return (
          staff.gender === user.gender_specification &&
          (staff.is_syoninsya || staff.is_zitsumusya) &&
          (staff.is_kodo || staff.is_kaigo)
        );
      } else if (
        user.city === '枚方市' &&
        (user.disability_type === '精神' ||
          user.disability_type === '精神・身体' ||
          user.disability_type === '知的・精神' ||
          user.disability_type === '知的・精神・身体')
      ) {
        return (staff.is_syoninsya || staff.is_zitsumusya) && (staff.is_kodo || staff.is_kaigo);
      } else {
        return staff.is_syoninsya || staff.is_zitsumusya || staff.is_kaigo;
      }
    case KYOTAKU:
      if (user.gender_specification) {
        return staff.gender === user.gender_specification && (staff.is_syoninsya || staff.is_zitsumusya || staff.is_kaigo);
      } else {
        return staff.is_syoninsya || staff.is_zitsumusya || staff.is_kaigo;
      }
    default:
      return false;
  }
};
