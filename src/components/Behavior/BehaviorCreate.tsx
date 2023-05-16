import { Divider, LoadingOverlay, Paper, Space, Stack } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import { CustomStepper } from '../Common/CustomStepper';
import {
  CreateBehaviorParams,
  createInitialState,
} from '@/ducks/behavior/slice';
import { validate } from '@/utils/validate/behavior';
import { useFocusTrap } from '@mantine/hooks';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
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
import { UseGetFormType, useGetForm } from '@/hooks/form/useGetForm';
import { RecordBasicInfo } from '../Common/RecordBasicInfo';
import { RecordContentArray } from '../Common/RecordContentArray';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { recordSubmit } from '@/hooks/form/recordSubmit';
import {
  useCreateScheduleMutation,
  useGetScheduleListQuery,
  useUpdateScheduleMutation,
} from '@/ducks/schedule/query';
import { excludingSelected } from '@/utils';

type Props = {
  type: 'create' | 'edit';
};

export const BehaviorCreate: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const behaviorId = router.query.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const behaviorList = useSelector(
    (state: RootState) => state.behavior.behaviorList
  );
  const {
    data: behaviorData,
    isLoading: behaviorLoding,
    refetch: behaviorRefetch,
  } = useGetBehaviorDataQuery(behaviorId || skipToken);
  const { data: userList = [] } = useGetUserListByServiceQuery('is_kodo');
  const { data: staffList = [] } = useGetStaffListByServiceQuery('kodo');
  // TODO: 作成・更新の時のみ呼び出すようにしたい
  const { data: scheduleList = [], refetch: scheduleRefetch } =
    useGetScheduleListQuery();
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [createBehavior] = useCreateBehaviorMutation();
  const [updateBehavior] = useUpdateBehaviorMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
  }: UseGetFormType<CreateBehaviorParams> = useGetForm(
    createInitialState,
    behaviorData,
    behaviorRefetch,
    validate
  );

  const userListExcludingSelected = useMemo(() => {
    return excludingSelected(userList, behaviorList, form);
  }, [userList, behaviorList, form.values.year, form.values.month]);

  const selectedUser = userList.find((user) => user.name === form.values.name);

  const handleSubmit = async () => {
    setIsLoading(true);
    recordSubmit({
      type,
      SERVICE_CONTENT: '行動援護',
      form: form,
      selectedUser: selectedUser,
      loginProviderInfo: loginProviderInfo,
      creteRecord: createBehavior,
      updateRecord: updateBehavior,
      recordData: behaviorData,
      createSchedule,
      updateSchedule,
      router,
      staffList,
      scheduleList,
    });
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
            type={type}
            form={form}
            userList={userListExcludingSelected}
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
