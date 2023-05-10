import {
  Divider,
  LoadingOverlay,
  Paper,
  Space,
  Stack,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { CustomStepper } from '../Common/CustomStepper';
import {
  CreateBehaviorParams,
  CreateBehaviorResult,
  UpdateBehaviorParams,
  UpdateBehaviorResult,
  createInitialState,
} from '@/ducks/behavior/slice';
import { validate } from '@/utils/validate/behavior';
import { useFocusTrap } from '@mantine/hooks';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import { IconCheckbox } from '@tabler/icons';
import { CustomConfirm } from '../Common/CustomConfirm';
import { showNotification } from '@mantine/notifications';
import { getPath } from '@/utils/const/getPath';
import { useRouter } from 'next/router';
import {
  useCreateBehaviorMutation,
  useGetBehaviorDataQuery,
  useUpdateBehaviorMutation,
} from '@/ducks/behavior/query';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { CustomButton } from '../Common/CustomButton';
import { NextPage } from 'next';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetForm } from '@/hooks/form/useGetForm';
import { RecordBasicInfo } from '../Common/RecordBasicInfo';
import { RecordContentArray } from '../Common/RecordContentArray';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { ContentArr } from '@/ducks/accompany/slice';

type Props = {
  type: 'create' | 'edit';
};

export const BehaviorCreate: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const BehaviorId = router.query.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const {
    data: behaviorData,
    isLoading: behaviorLoding,
    refetch,
  } = useGetBehaviorDataQuery(BehaviorId || skipToken);
  const { data: userList = [] } =
    useGetUserListByServiceQuery('is_kodo');
  const { data: staffList = [] } =
    useGetStaffListByServiceQuery('kodo');
  const [createBehavior] = useCreateBehaviorMutation();
  const [updateBehavior] = useUpdateBehaviorMutation();
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
    if (!behaviorData) return;
    refetch();
    const newContentArr = [
      ...behaviorData.content_arr,
      ...Array.from(
        { length: 40 - behaviorData.content_arr.length },
        () => createInitialState.content_arr[0]
      ),
    ];
    form.setValues({
      ...behaviorData,
      content_arr: newContentArr,
    });
  }, [behaviorData]);

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
          service_content: '行動援護',
        };
      })
      .sort(
        (a: ContentArr, b: ContentArr) => a.work_date! - b.work_date!
      );
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
        const params: CreateBehaviorParams = {
          ...form.values,
          content_arr: formatArr,
          identification: selectedUser!.identification,
          corporate_id: loginProviderInfo.corporate_id,
          login_id: loginProviderInfo.id,
        };
        const { error } = (await createBehavior(
          params
        )) as CreateBehaviorResult;
        if (error) {
          throw new Error(`記録票の${TITLE}に失敗しました。${error}`);
        }
        showNotification({
          icon: <IconCheckbox />,
          message: `${TITLE}に成功しました！`,
        });
        router.push(getPath('BEHAVIOR'));
      } else {
        const params: UpdateBehaviorParams = {
          ...form.values,
          id: behaviorData!.id,
          content_arr: formatArr,
          identification: selectedUser!.identification,
          corporate_id: loginProviderInfo.corporate_id,
          login_id: loginProviderInfo.id,
        };
        const { error } = (await updateBehavior(
          params
        )) as UpdateBehaviorResult;
        if (error) {
          throw new Error(`記録票の${TITLE}に失敗しました。${error}`);
        }
        showNotification({
          icon: <IconCheckbox />,
          message: `${TITLE}に成功しました！`,
        });
        router.push(getPath('BEHAVIOR'));
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
      <LoadingOverlay className="relative" visible={behaviorLoding} />
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
