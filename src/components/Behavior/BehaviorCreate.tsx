import { Divider, LoadingOverlay, Overlay, Paper, Space, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { CustomStepper } from '../Common/CustomStepper';
import { CreateBehaviorParams, createInitialState } from '@/ducks/behavior/slice';
import { validate } from '@/utils/validate/behavior';
import { useFocusTrap } from '@mantine/hooks';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import { useRouter } from 'next/router';
import { useCreateBehaviorMutation, useGetBehaviorDataQuery, useUpdateBehaviorMutation } from '@/ducks/behavior/query';
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
import { useSelector } from '@/ducks/store';
import { useHasPermit } from '@/hooks/form/useHasPermit';

type Props = {
  type: 'create' | 'edit';
};

export const BehaviorCreate: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const SERVICE_CONTENT = '行動援護';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const { hasPermit } = useHasPermit();
  const behaviorId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const behaviorList = useSelector((state) => state.behavior.behaviorList);
  const {
    data: behaviorData,
    isLoading: behaviorLoading,
    refetch: behaviorRefetch,
  } = useGetBehaviorDataQuery(behaviorId || skipToken);
  const { data: userList = [] } = useGetUserListByServiceQuery('is_kodo');
  const { data: staffList } = useGetStaffListByServiceQuery('kodo');
  const [createBehavior] = useCreateBehaviorMutation();
  const [updateBehavior] = useUpdateBehaviorMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
    recordSubmit,
  }: UseGetFormType<CreateBehaviorParams> = useGetForm({
    type,
    SERVICE_CONTENT,
    createInitialState,
    recordData: behaviorData,
    refetch: behaviorRefetch,
    validate,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await recordSubmit({
      createRecord: createBehavior,
      updateRecord: updateBehavior,
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
      router.push(getPath('BEHAVIOR'));
    }
  };

  return (
    <Stack>
      <LoadingOverlay className="relative" visible={behaviorLoading} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
        {!hasPermit(behaviorData?.status || 0, 'enableEdit') && <Overlay opacity={0.6} color="#fff" zIndex={5} radius="md" />}
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo type={type} form={form} recordList={behaviorList} amountTime={amountTime} />
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
