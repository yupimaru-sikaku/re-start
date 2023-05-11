import React from 'react';
import { CustomConfirm } from '@/components/Common/CustomConfirm';
import { PATH, getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { NextRouter } from 'next/router';
import { User } from '@/ducks/user/slice';
import { LoginProviderInfoType } from '@/ducks/provider/slice';
import { ReturnStaff } from '@/ducks/staff/slice';
import { ReturnSchedule } from '@/ducks/schedule/slice';
import { ContentArr } from '@/ducks/accompany/slice';

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'create' | 'edit';
  TITLE: '登録' | '更新';
  SERVICE_CONTENT: '同行援護' | '行動援護' | '移動支援';
  PATH: keyof typeof PATH;
  form: any;
  selectedUser: User | undefined;
  loginProviderInfo: LoginProviderInfoType;
  creteRecord: any;
  updateRecord: any;
  reordData: any;
  createSchedule: any;
  updateSchedule: any;
  router: NextRouter;
  staffList: ReturnStaff[];
  scheduleList: ReturnSchedule[];
};

export const submit = async ({
  setIsLoading,
  type,
  TITLE,
  SERVICE_CONTENT,
  PATH,
  form,
  selectedUser,
  loginProviderInfo,
  creteRecord,
  updateRecord,
  reordData,
  createSchedule,
  updateSchedule,
  router,
  staffList,
  scheduleList,
}: Props) => {
  const isOK = await CustomConfirm(
    `実績記録票を${TITLE}しますか？後から修正は可能です。`,
    '確認画面'
  );
  if (!isOK) {
    setIsLoading(false);
    return;
  }
  // 空欄がある場合に除外して市区町村とサービス種別を加えて日付順にソート
  const formatArr: ContentArr[] = form.values.content_arr
    .filter((content: ContentArr) => {
      return content.work_date && content.start_time && content.end_time;
    })
    .map((content: ContentArr) => {
      return {
        ...content,
        city: selectedUser!.city,
        service_content: SERVICE_CONTENT,
      };
    })
    .sort((a: ContentArr, b: ContentArr) => a.work_date! - b.work_date!);
  if (formatArr.length === 0) {
    await CustomConfirm('記録は、少なくとも一行は作成ください。', 'Caution');
    setIsLoading(false);
    return;
  }
  try {
    const params = {
      ...form.values,
      login_id: loginProviderInfo.id,
      corporate_id: loginProviderInfo.corporate_id,
      identification: selectedUser!.identification,
      content_arr: formatArr,
    };
    const { error } =
      type === 'create'
        ? await creteRecord(params)
        : await updateRecord({
            ...params,
            id: reordData!.id,
          });
    if (error) {
      throw new Error(`記録票の${TITLE}に失敗しました。${error.message}`);
    }
    // スタッフの名前毎に配列を作成した作成した新しい配列を作成[][]
    const format2DArray = Object.values(
      formatArr.reduce<{
        [key: string]: ContentArr[];
      }>((result, currentValue) => {
        if (
          currentValue['staff_name'] !== null &&
          currentValue['staff_name'] !== undefined
        ) {
          (result[currentValue['staff_name']] =
            result[currentValue['staff_name']] || []).push(currentValue);
        }
        return result;
      }, {})
    );
    format2DArray.map(async (contentList) => {
      const staffName = contentList[0].staff_name;
      const selectedStaff = staffList.find((staff) => staff.name === staffName);
      const selectedSchedule = scheduleList.find(
        (schedule) =>
          schedule.year === form.values.year &&
          schedule.month === form.values.month &&
          schedule.staff_name === staffName
      );
      // スケジュールが存在する場合
      let newContentArr = [];
      if (selectedSchedule) {
        const removeContentArr = selectedSchedule.content_arr.filter(
          (content) =>
            content.user_name !== selectedUser!.name &&
            content.service_content !== SERVICE_CONTENT
        );
        const contentNewList = contentList.map((content) => {
          let { staff_name, ...rest } = content;
          return { ...rest, user_name: selectedUser!.name };
        });
        newContentArr = [...removeContentArr, ...contentNewList];
      } else {
        newContentArr = contentList.map((content) => {
          let { staff_name, ...rest } = content;
          return { ...rest, user_name: selectedUser!.name };
        });
      }
      const createScheduleParams = {
        staff_id: selectedStaff!.id,
        staff_name: selectedStaff!.name,
        year: form.values.year,
        month: form.values.month,
        content_arr: newContentArr,
      };
      const { error } = selectedSchedule
        ? await updateSchedule({
            ...createScheduleParams,
            id: selectedSchedule.id,
          })
        : await createSchedule(createScheduleParams);
      if (error) {
        throw new Error(
          `スタッフのスケジュール${TITLE}に失敗しました。${error.message}`
        );
      }
    });
    showNotification({
      icon: <IconCheckbox />,
      message: `${TITLE}に成功しました！`,
    });
    router.push(getPath(PATH));
  } catch (error: any) {
    await CustomConfirm(error.message, 'Caution');
    setIsLoading(false);
    return;
  }
  setIsLoading(false);
};
