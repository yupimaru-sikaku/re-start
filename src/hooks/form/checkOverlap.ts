import { ContentArr } from '@/ducks/accompany/slice';
import { ReturnSchedule, ScheduleContentArr } from '@/ducks/schedule/slice';
import { ReturnUser } from '@/ducks/user/slice';

export const checkOverlap = (
  format2DArray: ContentArr[][],
  scheduleList: ReturnSchedule[],
  selectedUser: ReturnUser | undefined,
  form: any
) => {
  const errorMessageList = format2DArray
    .map((contentList) => {
      const staffName = contentList[0].staff_name;
      const selectedSchedule = scheduleList.find(
        (schedule) =>
          schedule.year === form.values.year &&
          schedule.month === form.values.month &&
          schedule.staff_name === staffName
      );
      if (selectedSchedule) {
        const removeContentArr = selectedSchedule.content_arr.filter(
          (content) => content.user_name !== selectedUser!.name
        );
        const isOverlap = hasOverlap(removeContentArr, contentList);
        if (isOverlap) {
          return staffName;
        }
      }
      return null;
    })
    .filter((errorMessage) => errorMessage !== null);
  return errorMessageList;
};

const hasOverlap = (
  removeContentArr: ScheduleContentArr[],
  contentList: ContentArr[]
) => {
  return removeContentArr.some((removeItem) => {
    const removeStart = new Date(removeItem.start_time);
    const removeEnd = new Date(removeItem.end_time);
    return contentList.some((contentItem) => {
      const contentStart = new Date(contentItem.start_time);
      const contentEnd = new Date(contentItem.end_time);
      return (
        (removeStart > contentStart && removeStart < contentEnd) ||
        (removeEnd > contentStart && removeEnd < contentEnd) ||
        (removeStart < contentStart && removeEnd > contentEnd)
      );
    });
  });
};
