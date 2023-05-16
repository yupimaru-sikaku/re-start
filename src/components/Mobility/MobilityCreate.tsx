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
import { CustomButton } from '../Common/CustomButton';
import { NextPage } from 'next';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { UseGetFormType, useGetForm } from '@/hooks/form/useGetForm';
import { RecordBasicInfo } from '../Common/RecordBasicInfo';
import { RecordContentArray } from '../Common/RecordContentArray';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { getPath } from '@/utils/const/getPath';

type Props = {
  type: 'create' | 'edit';
};

export const MobilityCreate: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const SERVICE_CONTENT = '移動支援';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const mobilityId = router.query.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: mobilityData,
    isLoading: mobilityLoading,
    refetch: mobilityRefetch,
  } = useGetMobilityDataQuery(mobilityId || skipToken);
  const { data: userList = [] } = useGetUserListByServiceQuery('is_ido');
  const { data: staffList } = useGetStaffListByServiceQuery('ido');
  const [createMobility] = useCreateMobilityMutation();
  const [updateMobility] = useUpdateMobilityMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
    recordSubmit,
  }: UseGetFormType<CreateMobilityParams> = useGetForm({
    type,
    SERVICE_CONTENT,
    createInitialState,
    recordData: mobilityData,
    refetch: mobilityRefetch,
    validate,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await recordSubmit({
      createRecord: createMobility,
      updateRecord: updateMobility,
    });
    if (!result.isFinished) {
      if (result.message) {
        await CustomConfirm(result.message, 'Caution');
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } else {
      showNotification({
        icon: <IconCheckbox />,
        message: `${TITLE}に成功しました！`,
      });
      router.push(getPath('MOBILITY'));
    }
  };

  return (
    <Stack>
      <LoadingOverlay className="relative" visible={mobilityLoading} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo type={type} form={form} amountTime={amountTime} />
          <Space h="lg" />
          <Divider variant="dotted" />
          <Space h="lg" />
          <RecordContentArray
            form={form}
            handleChangeDate={handleChangeDate}
            handleChangeTime={handleChangeTime}
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
