import { getPath } from '@/utils/const/getPath';
import { Divider, LoadingOverlay, Paper, Space, Stack } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CustomButton } from '../Common/CustomButton';
import { CustomConfirm } from '../Common/CustomConfirm';
import { CustomStepper } from '../Common/CustomStepper';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import {
  ContentArr,
  CreateAccompanyParams,
  CreateAccompanyResult,
  UpdateAccompanyResult,
  createInitialState,
} from '@/ducks/accompany/slice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import {
  useCreateAccompanyMutation,
  useGetAccompanyDataQuery,
  useUpdateAccompanyMutation,
} from '@/ducks/accompany/query';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import {
  CreateScheduleParams,
  CreateScheduleResult,
  UpdateScheduleResult,
} from '@/ducks/schedule/slice';
import {
  useCreateScheduleMutation,
  useGetScheduleListQuery,
  useUpdateScheduleMutation,
} from '@/ducks/schedule/query';
import { UseGetFormType, useGetForm } from '@/hooks/form/useGetForm';
import { RecordBasicInfo } from '../Common/RecordBasicInfo';
import { RecordContentArray } from '../Common/RecordContentArray';
import { validate } from '@/utils/validate/accompany';

type Props = {
  type: 'create' | 'edit';
};

export const AccompanyCreate: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const AccompanyId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const {
    data: accompanyData,
    isLoading: accompanyLoading,
    refetch,
  } = useGetAccompanyDataQuery(AccompanyId || skipToken);
  const { data: userList = [] } = useGetUserListByServiceQuery('is_doko');
  const { data: staffList = [] } = useGetStaffListByServiceQuery('doko');
  // TODO: 作成・更新の時のみ呼び出すようにしたい
  const { data: scheduleList = [] } = useGetScheduleListQuery();
  const [createAccompany] = useCreateAccompanyMutation();
  const [updateAccompany] = useUpdateAccompanyMutation();
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
  }: UseGetFormType<CreateAccompanyParams> = useGetForm(
    createInitialState,
    accompanyData,
    refetch,
    validate
  );
  const selectedUser = userList.find((user) => user.name === form.values.name);

  const handleSubmit = async () => {
    setIsLoading(true);
    const isOK = await CustomConfirm(
      `実績記録票を${TITLE}しますか？後から修正は可能です。`,
      '確認画面'
    );
    if (!isOK) {
      setIsLoading(false);
      return;
    }
    // 空欄がある場合に除外して市区町村とサービス種別を加えて日付順にソート
    const formatArr = form.values.content_arr
      .filter((content) => {
        return content.work_date && content.start_time && content.end_time;
      })
      .map((content) => {
        return {
          ...content,
          city: selectedUser!.city,
          service_content: '同行援護',
        };
      })
      .sort((a: ContentArr, b: ContentArr) => a.work_date! - b.work_date!);
    if (formatArr.length === 0) {
      await CustomConfirm('記録は、少なくとも一行は作成ください。', 'Caution');
      setIsLoading(false);
      return;
    }
    try {
      const params: CreateAccompanyParams = {
        ...form.values,
        login_id: loginProviderInfo.id,
        corporate_id: loginProviderInfo.corporate_id,
        identification: selectedUser!.identification,
        content_arr: formatArr,
      };
      const { error } =
        type === 'create'
          ? ((await createAccompany(params)) as CreateAccompanyResult)
          : ((await updateAccompany({
              ...params,
              id: accompanyData!.id,
            })) as UpdateAccompanyResult);
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
              content.user_name !== selectedUser!.name &&
              content.service_content !== '同行援護'
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
        const createScheduleParams: CreateScheduleParams = {
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
            })) as CreateScheduleResult)
          : ((await createSchedule(
              createScheduleParams
            )) as UpdateScheduleResult);
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
      router.push(getPath('ACCOMPANY'));
    } catch (error: any) {
      await CustomConfirm(error.message, 'Caution');
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <Stack>
      <LoadingOverlay className="relative" visible={accompanyLoading} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo
            type={type}
            form={form}
            userList={userList}
            selectedUser={selectedUser}
            amountTime={amountTime}
          />
          <Space h="lg" />
          <Divider variant="dotted" />
          <Space h="lg" />
          <RecordContentArray
            form={form}
            handleChangeDate={handleChangeDate}
            handleChangeTime={handleChangeTime}
            staffList={staffList}
            handleChangeStaff={handleChangeStaff}
            handleRefresh={handleRefresh}
          />
          <Space h="xl" />
          <CustomButton type="submit" fullWidth loading={isLoading}>
            {TITLE}
          </CustomButton>
        </Paper>
      </form>
    </Stack>
  );
};
