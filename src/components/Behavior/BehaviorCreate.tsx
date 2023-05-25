import React, { useState } from 'react';
import { NextPage } from 'next';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { CustomButton } from 'src/components/Common/CustomButton';
import { CustomStepper } from 'src/components/Common/CustomStepper';
import { RecordBasicInfo } from 'src/components/Common/RecordBasicInfo';
import { RecordContentArray } from 'src/components/Common/RecordContentArray';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { Divider, LoadingOverlay, Overlay, Paper, Space, Stack } from '@mantine/core';
import { CreateBehaviorParams, createInitialState } from '@/ducks/behavior/slice';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import { useCreateBehaviorMutation, useUpdateBehaviorMutation } from '@/ducks/behavior/query';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { UseGetRecordFormType, useGetRecordForm } from '@/hooks/form/useGetRecordForm';
import { validate } from '@/utils/validate/behavior';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
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
  const behaviorId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { hasPermit } = useHasPermit();
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const behaviorList = useSelector((state) => state.behavior.behaviorList);
  const behaviorData = behaviorList.find((behavior) => behavior.id === behaviorId);
  const { data: userList = [] } = useGetUserListByServiceQuery({
    corporateId: loginProviderInfo.corporate_id,
    serviceName: 'is_kodo',
  });
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
  }: UseGetRecordFormType<CreateBehaviorParams> = useGetRecordForm({
    type,
    SERVICE_CONTENT,
    createInitialState,
    recordData: behaviorData,
    createRecord: createBehavior,
    updateRecord: updateBehavior,
    validate,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await recordSubmit();
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
      <LoadingOverlay className="relative" visible={type === 'edit' && !behaviorData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper statusId={behaviorData?.status} />
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
