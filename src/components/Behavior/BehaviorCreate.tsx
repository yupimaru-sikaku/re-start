import React, { FC, useMemo, useState } from 'react';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { CustomButton } from 'src/components/Common/CustomButton';
import { CustomStepper } from 'src/components/Common/CustomStepper';
import { RecordBasicInfo } from 'src/components/Common/RecordBasicInfo';
import { RecordContentArray } from 'src/components/Common/RecordContentArray';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { Divider, LoadingOverlay, Overlay, Paper, Space, Stack } from '@mantine/core';
import { CreateBehaviorParams, createInitialState } from '@/ducks/behavior/slice';
import { useGetUserListQuery } from '@/ducks/user/query';
import { useCreateBehaviorMutation, useUpdateBehaviorMutation } from '@/ducks/behavior/query';
import { useGetStaffListQuery } from '@/ducks/staff/query';
import { UseGetRecordFormType, useGetRecordForm } from '@/hooks/form/useGetRecordForm';
import { validate } from '@/utils/validate/behavior';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { useSelector } from '@/ducks/store';
import { useHasPermit } from '@/hooks/form/useHasPermit';
import { KODO } from '@/utils';

type Props = {
  type: 'create' | 'edit';
};

export const BehaviorCreate: FC<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const { hasPermit } = useHasPermit();
  const behaviorId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const behaviorList = useSelector((state) => state.behavior.behaviorList);
  const selectedBehaviorList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return behaviorList;
      case 'corporate':
        return behaviorList.filter((behavior) => behavior.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return behaviorList.filter((behavior) => behavior.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [behaviorList, loginProviderInfo]);
  const userList = useSelector((state) => state.user.userList);
  const behaviorData = selectedBehaviorList.find((behavior) => behavior.id === behaviorId);
  const { isLoading: userLoading } = useGetUserListQuery(undefined);
  const selectedUserList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return userList;
      case 'corporate':
        return userList.filter((user) => user.is_kodo && user.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return userList.filter((user) => user.is_kodo && user.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [userList]);
  const selectedUser = userList.find((user) => user.name === form.values.user_name);
  const { isLoading: staffLoading } = useGetStaffListQuery(undefined);
  const staffList = useSelector((state) => state.staff.staffList);
  // TODO：どの資格があればサービスを提供できるか
  const selectedStaffList = staffList.filter((staff) => {
    if (staff.is_kodo) {
      if (selectedUser && selectedUser.gender_specification) {
        return staff.gender === selectedUser.gender_specification;
      }
      return true;
    }
    return false;
  });
  const [createBehavior] = useCreateBehaviorMutation();
  const [updateBehavior] = useUpdateBehaviorMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
    contractedAmountTime,
    recordSubmit,
  }: UseGetRecordFormType<CreateBehaviorParams> = useGetRecordForm({
    type,
    SERVICE_CONTENT: KODO,
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
      <LoadingOverlay sx={{ position: 'relative' }} visible={type === 'edit' && !behaviorData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper statusId={behaviorData?.status} />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
        {!hasPermit(behaviorData?.status || 0, 'enableEdit') && <Overlay opacity={0.6} color="#fff" zIndex={5} radius="md" />}
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo
            type={type}
            form={form}
            recordList={selectedBehaviorList}
            userList={selectedUserList}
            amountTime={amountTime}
            contractedAmountTime={contractedAmountTime}
          />
          <Space h="lg" />
          <Divider variant="dotted" />
          <Space h="lg" />
          <RecordContentArray
            form={form}
            staffList={selectedStaffList}
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
