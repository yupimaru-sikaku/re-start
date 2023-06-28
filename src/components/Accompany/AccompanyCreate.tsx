import React, { FC, useMemo, useState } from 'react';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { CustomButton } from '@/components/Common/CustomButton';
import { CustomStepper } from '@/components/Common/CustomStepper';
import { RecordBasicInfo } from '@/components/Common/RecordBasicInfo';
import { RecordContentArray } from '@/components/Common/RecordContentArray';
import { CustomConfirm } from '@/components/Common/CustomConfirm';
import { Divider, LoadingOverlay, Overlay, Paper, Space, Stack } from '@mantine/core';
import { CreateAccompanyParams, createInitialState } from '@/ducks/accompany/slice';
import { useGetUserListQuery } from '@/ducks/user/query';
import { useCreateAccompanyMutation, useUpdateAccompanyMutation } from '@/ducks/accompany/query';
import { useGetStaffListQuery } from '@/ducks/staff/query';
import { UseGetRecordFormType, useGetRecordForm } from '@/hooks/form/useGetRecordForm';
import { validate } from '@/utils/validate/accompany';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { useSelector } from '@/ducks/store';
import { useHasPermit } from '@/hooks/form/useHasPermit';
import { DOKO, isQualifiedToProvideService } from '@/utils';

type Props = {
  type: 'create' | 'edit';
};

export const AccompanyCreate: FC<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const router = useRouter();
  const { hasPermit } = useHasPermit();
  const accompanyId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const accompanyList = useSelector((state) => state.accompany.accompanyList);
  const selectedAccompanyList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return accompanyList;
      case 'corporate':
        return accompanyList.filter((accompany) => accompany.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return accompanyList.filter((accompany) => accompany.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [accompanyList, loginProviderInfo]);
  const userList = useSelector((state) => state.user.userList);
  const accompanyData = selectedAccompanyList.find((accompany) => accompany.id === accompanyId);
  const focusTrapRef = useFocusTrap(hasPermit(accompanyData?.status || 0, 'enableEdit'));
  const { isLoading: userLoading } = useGetUserListQuery(undefined);
  const selectedUserList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return userList.filter((user) => user.is_doko);
      case 'corporate':
        return userList.filter((user) => user.is_doko && user.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return userList.filter((user) => user.is_doko && user.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [userList]);
  const { isLoading: staffLoading } = useGetStaffListQuery(undefined);
  const staffList = useSelector((state) => state.staff.staffList);
  const [createAccompany] = useCreateAccompanyMutation();
  const [updateAccompany] = useUpdateAccompanyMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
    contractedAmountTime,
    recordSubmit,
  }: UseGetRecordFormType<CreateAccompanyParams> = useGetRecordForm({
    type,
    SERVICE_CONTENT: DOKO,
    createInitialState,
    recordData: accompanyData,
    createRecord: createAccompany,
    updateRecord: updateAccompany,
    validate,
  });
  const selectedUser = userList.find((user) => user.name === form.values.user_name);
  const selectedStaffList = staffList.filter((staff) => {
    return isQualifiedToProvideService(staff, DOKO, selectedUser);
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
      router.push(getPath('ACCOMPANY'));
    }
  };

  return (
    <Stack>
      <LoadingOverlay visible={type === 'edit' && !accompanyData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper statusId={accompanyData?.status} />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
        {!hasPermit(accompanyData?.status || 0, 'enableEdit') && <Overlay opacity={0.6} color="#fff" zIndex={5} radius="md" />}
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo
            type={type}
            form={form}
            recordList={selectedAccompanyList}
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
