import { Divider, LoadingOverlay, Paper, Space, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { CustomStepper } from '../Common/CustomStepper';
import {
  CreateMobilityParams,
  createInitialState,
} from '@/ducks/mobility/slice';
import { validate } from '@/utils/validate/mobility';
import { useFocusTrap } from '@mantine/hooks';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import { useRouter } from 'next/router';
import {
  useCreateMobilityMutation,
  useGetMobilityDataQuery,
  useUpdateMobilityMutation,
} from '@/ducks/mobility/query';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { CustomButton } from '../Common/CustomButton';
import { NextPage } from 'next';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { UseGetFormType, useGetForm } from '@/hooks/form/useGetForm';
import { RecordBasicInfo } from '../Common/RecordBasicInfo';
import { RecordContentArray } from '../Common/RecordContentArray';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { submit } from '@/hooks/form/submit';
import {
  useCreateScheduleMutation,
  useGetScheduleListQuery,
  useUpdateScheduleMutation,
} from '@/ducks/schedule/query';

type Props = {
  type: 'create' | 'edit';
};

export const MobilityCreate: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const mobilityId = router.query.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const {
    data: mobilityData,
    isLoading: mobilityLoading,
    refetch,
  } = useGetMobilityDataQuery(mobilityId || skipToken);
  const { data: userList = [] } = useGetUserListByServiceQuery('is_ido');
  const { data: staffList = [] } = useGetStaffListByServiceQuery('ido');
  // TODO: 作成・更新の時のみ呼び出すようにしたい
  const { data: scheduleList = [], refetch: scheduleRefetch } =
    useGetScheduleListQuery();
  const [createMobility] = useCreateMobilityMutation();
  const [updateMobility] = useUpdateMobilityMutation();
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
  }: UseGetFormType<CreateMobilityParams> = useGetForm(
    createInitialState,
    mobilityData,
    refetch,
    validate
  );
  const selectedUser = userList.find((user) => user.name === form.values.name);

  const handleSubmit = async () => {
    submit({
      setIsLoading: setIsLoading,
      type,
      TITLE,
      SERVICE_CONTENT: '移動支援',
      PATH: 'MOBILITY',
      form: form,
      selectedUser: selectedUser,
      loginProviderInfo: loginProviderInfo,
      creteRecord: createMobility,
      updateRecord: updateMobility,
      reordData: mobilityData,
      createSchedule,
      updateSchedule,
      router,
      staffList,
      scheduleList,
      scheduleRefetch,
    });
  };

  return (
    <Stack>
      <LoadingOverlay className="relative" visible={mobilityLoading} />
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
