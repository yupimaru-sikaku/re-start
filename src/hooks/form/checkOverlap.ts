import { ContentArr } from '@/ducks/accompany/slice';
import { ReturnSchedule, ScheduleContentArr } from '@/ducks/schedule/slice';
import { ReturnUser } from '@/ducks/user/slice';

export const checkOverlap = (
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
        (schedule) =>
          schedule.year === year &&
          schedule.month === month &&
          schedule.staff_name === staffName
      );
      if (selectedSchedule) {
        const removeContentArr = selectedSchedule.content_arr.filter(
          (content) =>
            content.user_name !== selectedUser!.name ||
            content.service_content !== SERVICE_CONTENT
        );
        const isOverlap = hasOverlap(removeContentArr, contentList);
        if (isOverlap) {
          return staffName;
        }
      }
      return null;
    })
    .filter((errorMessage) => errorMessage !== null);
  return errorMessasgeList;
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

      const isSameDay =
        removeStart.getFullYear() === contentStart.getFullYear() &&
        removeStart.getMonth() === contentStart.getMonth() &&
        removeStart.getDate() === contentStart.getDate();

      return (
        isSameDay &&
        ((contentStart >= removeStart && contentStart < removeEnd) ||
          (contentEnd > removeStart && contentEnd <= removeEnd) ||
          (contentStart <= removeStart && contentEnd >= removeEnd))
      );
    });
  });
};