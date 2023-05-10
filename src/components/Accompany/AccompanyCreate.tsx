import { getPath } from '@/utils/const/getPath';
import {
  Divider,
  LoadingOverlay,
  Paper,
  Space,
  Stack,
} from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CustomButton } from '../Common/CustomButton';
import { CustomConfirm } from '../Common/CustomConfirm';
import { CustomStepper } from '../Common/CustomStepper';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import {
  ContentArr,
  CreateAccompanyParams,
  CreateAccompanyResult,
  UpdateAccompanyParams,
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
import { CreateScheduleParams } from '@/ducks/schedule/slice';
import { useCreateScheduleMutation } from '@/ducks/schedule/query';
import { useGetForm } from '@/hooks/form/useGetForm';
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
    isLoading: accompanyLoding,
    refetch,
  } = useGetAccompanyDataQuery(AccompanyId || skipToken);
  const { data: userList = [] } =
    useGetUserListByServiceQuery('is_doko');
  const { data: staffList = [] } =
    useGetStaffListByServiceQuery('doko');
  const [createAccompany] = useCreateAccompanyMutation();
  const [updateAccompany] = useUpdateAccompanyMutation();
  const [createSchedule] = useCreateScheduleMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
  } = useGetForm(createInitialState, validate);
  const selectedUser = userList.find(
    (user) => user.name === form.values.name
  );

  // useFormは再レンダリングされないので
  useEffect(() => {
    if (!accompanyData) return;
    refetch();
    const newContentArr = [
      ...accompanyData.content_arr,
      ...Array.from(
        { length: 40 - accompanyData.content_arr.length },
        () => createInitialState.content_arr[0]
      ),
    ];
    form.setValues({
      ...accompanyData,
      content_arr: newContentArr,
    });
  }, [accompanyData]);

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
    // データ整形（空欄がある場合に無視、日付順にソート）
    const formatArr: ContentArr[] = form.values.content_arr
      .filter((content: ContentArr) => {
        return (
          content.work_date && content.start_time && content.end_time
        );
      })
      .map((content: ContentArr) => {
        return {
          ...content,
          city: selectedUser!.city,
          service_content: '同行援護',
        };
      })
      .sort((a: ContentArr, b: ContentArr) => a.work_date! - b.work_date!);
    if (formatArr.length === 0) {
      await CustomConfirm(
        '記録は、少なくとも一行は作成ください。',
        'Caution'
      );
      setIsLoading(false);
      return;
    }
    try {
      if (type === 'create') {
        const params: CreateAccompanyParams = {
          ...form.values,
          content_arr: formatArr,
          identification: selectedUser!.identification,
          corporate_id: loginProviderInfo.corporate_id,
          login_id: loginProviderInfo.id,
        };
        const { error } = (await createAccompany(
          params
        )) as CreateAccompanyResult;
        if (error) {
          throw new Error(
            `記録票の${TITLE}に失敗しました。${error.message}`
          );
        }
        showNotification({
          icon: <IconCheckbox />,
          message: `${TITLE}に成功しました！`,
        });
        router.push(getPath('ACCOMPANY'));
      } else {
        const params: UpdateAccompanyParams = {
          ...form.values,
          id: accompanyData!.id,
          content_arr: formatArr,
          identification: selectedUser!.identification,
          corporate_id: loginProviderInfo.corporate_id,
          login_id: loginProviderInfo.id,
        };
        const { error } = (await updateAccompany(
          params
        )) as UpdateAccompanyResult;
        if (error) {
          throw new Error(
            `記録票の${TITLE}に失敗しました。${error.message}`
          );
        }
        showNotification({
          icon: <IconCheckbox />,
          message: `${TITLE}に成功しました！`,
        });
        router.push(getPath('ACCOMPANY'));
      }
    } catch (error: any) {
      await CustomConfirm(error.message, 'Caution');
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <Stack>
      <LoadingOverlay
        className="relative"
        visible={accompanyLoding}
      />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo
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
