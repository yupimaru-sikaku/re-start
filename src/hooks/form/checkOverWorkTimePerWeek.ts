import { ContentArr } from '@/ducks/common-service/slice';
import { ReturnSchedule, ScheduleContentArr } from '@/ducks/schedule/slice';
import { ReturnUser } from '@/ducks/user/slice';
import { KYOTAKU, splitByWeeks } from '@/utils';
import { KAZI, SHINTAI, TSUIN, WITH_TSUIN } from '@/utils';

export const checkOverWorkTimePerWeek = (
  format2DArray: ContentArr[][],
  scheduleList: ReturnSchedule[],
  selectedUser: ReturnUser | undefined,
  SERVICE_CONTENT: string,
  year: number,
  month: number
) => {
  const errorMessasgeList = format2DArray
    .map((contentList) => {
      const staffName = contentList[0].staff_name;
      const selectedSchedule = scheduleList.find(
        (schedule) => schedule.year === year && schedule.month === month && schedule.staff_name === staffName
      );
      if (selectedSchedule) {
        // 利用者名とサービス名が異なる配列を作成
        const removeContentArr = selectedSchedule.content_arr.filter((content) => {
          if (SERVICE_CONTENT === KYOTAKU) {
            return !(
              content.user_name === selectedUser!.name &&
              (content.service_content === KAZI ||
                content.service_content === SHINTAI ||
                content.service_content === TSUIN ||
                content.service_content === WITH_TSUIN)
            );
          } else {
            return !(content.user_name === selectedUser!.name && content.service_content === SERVICE_CONTENT);
          }
        });
        const newArr: ScheduleContentArr[] = contentList.map((content) => {
          return { ...content, city: selectedUser!.city, user_name: selectedUser!.name };
        });
        const arr: ScheduleContentArr[] = [...removeContentArr, ...newArr];
        const a: ReturnSchedule = { ...selectedSchedule, content_arr: arr };
        const timePerWeekList = splitByWeeks(a, year, month);
        const isOverWorkTimePerWeek = timePerWeekList.some((time) => time > selectedSchedule.staff_work_time_per_week);
        if (isOverWorkTimePerWeek) {
          return staffName;
        }
      }
      return null;
    })
    .filter((errorMessage) => errorMessage !== null);
  return errorMessasgeList;
};
