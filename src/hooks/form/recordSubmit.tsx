import React from 'react';
import { CustomConfirm } from '@/components/Common/CustomConfirm';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { NextRouter } from 'next/router';
import { User } from '@/ducks/user/slice';
import { LoginProviderInfoType } from '@/ducks/provider/slice';
import { ReturnStaff } from '@/ducks/staff/slice';
import {
  CreateScheduleParams,
  CreateScheduleResult,
  ReturnSchedule,
  UpdateScheduleParams,
  UpdateScheduleResult,
} from '@/ducks/schedule/slice';
import { ContentArr } from '@/ducks/accompany/slice';
import { checkOverlap } from './checkOverlap';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { BaseQueryFn, MutationDefinition } from '@rtk-incubator/rtk-query/dist';
import { UseFormReturnType } from '@mantine/form';

type Props = {
  type: 'create' | 'edit';
  SERVICE_CONTENT: '同行援護' | '行動援護' | '移動支援';
  form: UseFormReturnType<any>;
  selectedUser: User | undefined;
  loginProviderInfo: LoginProviderInfoType;
  creteRecord: any;
  updateRecord: any;
  recordData: any;
  createSchedule: MutationTrigger<
    MutationDefinition<
      CreateScheduleParams,
      BaseQueryFn,
      'Schedule',
      CreateScheduleResult,
      'scheduleApi'
    >
  >;
  updateSchedule: MutationTrigger<
    MutationDefinition<
      UpdateScheduleParams,
      BaseQueryFn,
      'Schedule',
      UpdateScheduleResult,
      'scheduleApi'
    >
  >;
  router: NextRouter;
  staffList: ReturnStaff[];
  scheduleList: ReturnSchedule[];
};

export const recordSubmit = async ({
  type,
  SERVICE_CONTENT,
  form,
  selectedUser,
  loginProviderInfo,
  creteRecord,
  updateRecord,
  recordData,
  createSchedule,
  updateSchedule,
  router,
  staffList,
  scheduleList,
}: Props) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const PATH =
    SERVICE_CONTENT === '同行援護'
      ? 'ACCOMPANY'
      : SERVICE_CONTENT === '移動支援'
      ? 'MOBILITY'
      : 'BEHAVIOR';

  const isOK = await CustomConfirm(
    `実績記録票を${TITLE}しますか？後から修正は可能です。`,
    '確認画面'
  );
  if (!isOK) return;

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
  if (formatArr.length === 0) {
    await CustomConfirm('記録は、少なくとも一行は作成ください。', 'Caution');
    return;
  }
  // カレンダーが重複していないか確認
  if (loginProviderInfo.role === 'admin') {
    const errorMessageList = checkOverlap(
      format2DArray,
      scheduleList,
      selectedUser,
      SERVICE_CONTENT,
      form.values.year,
      form.values.month
    );
    if (errorMessageList.length) {
      await CustomConfirm(
        `スケジュールの時間が重複しています。${errorMessageList.join(' ')}`,
        'Caution'
      );
      return;
    }
  }
  try {
    const createRecordParams = {
      ...form.values,
      login_id: loginProviderInfo.id,
      corporate_id: loginProviderInfo.corporate_id,
      identification: selectedUser!.identification,
      content_arr: formatArr,
    };
    const { createRecordError } =
      type === 'create'
        ? await creteRecord(createRecordParams)
        : await updateRecord({
            ...createRecordParams,
            id: recordData!.id,
          });
    if (createRecordError) {
      throw new Error(
        `記録票の${TITLE}に失敗しました。${createRecordError.message}`
      );
    }
    const allStaffNameEmpty = format2DArray.every((subArray) =>
      subArray.every((content) => content.staff_name === '')
    );
    if (loginProviderInfo.role === 'admin' && !allStaffNameEmpty) {
      format2DArray.map(async (contentList) => {
        const staffName = contentList[0].staff_name;
        const selectedStaff = staffList.find(
          (staff) => staff.name === staffName
        );
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
              content.user_name !== selectedUser!.name ||
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
          ? ((await updateSchedule({
              ...createScheduleParams,
              id: selectedSchedule.id,
            })) as UpdateScheduleResult)
          : ((await createSchedule(
              createScheduleParams
            )) as CreateScheduleResult);
        if (error) {
          throw new Error(
            `スタッフのスケジュール${TITLE}に失敗しました。${error.message}`
          );
        }
      });
    }
    showNotification({
      icon: <IconCheckbox />,
      message: `${TITLE}に成功しました！`,
    });
    router.push(getPath(PATH));
  } catch (error: any) {
    await CustomConfirm(error.message, 'Caution');
    return;
  }
};
