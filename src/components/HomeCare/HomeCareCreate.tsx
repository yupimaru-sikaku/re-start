import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';
import { Overlay, Divider, LoadingOverlay, Paper, Space, Stack } from '@mantine/core';
import { CustomButton } from '../Common/CustomButton';
import { IconCheckbox } from '@tabler/icons';
import { CreateHomeCareParams, createInitialState } from '@/ducks/home-care/slice';
import { CustomConfirm } from '../Common/CustomConfirm';
import { validate } from '@/utils/validate/home-care';
import { CustomStepper } from '../Common/CustomStepper';
import { showNotification } from '@mantine/notifications';
import { getPath } from '@/utils/const/getPath';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { useGetUserListByServiceQuery, useGetUserListQuery } from '@/ducks/user/query';
import { useHasPermit } from '@/hooks/form/useHasPermit';
import { useGetStaffListByServiceQuery, useGetStaffListQuery } from '@/ducks/staff/query';
import { useCreateHomeCareMutation, useUpdateHomeCareMutation } from '@/ducks/home-care/query';
import { UseGetHomeCareRecordFormType, useGetHomeCareRecordForm } from '@/hooks/form/useGetHomeCareRecordForm';
import { HomeCareRecordBasicInfo } from './HomeCareRecordBasicInfo';
import { HomeCareRecordContentArray } from './HomeCareRecordContentArray';
import { KYOTAKU, isQualifiedToProvideService } from '@/utils';

type Props = {
  type: 'create' | 'edit';
};

export const HomeCareCreate: FC<Props> = ({ type }: Props) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const router = useRouter();
  const { hasPermit } = useHasPermit();
  const homeCareId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const homeCareList = useSelector((state) => state.homeCare.homeCareList);
  const selectedHomeCareList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return homeCareList;
      case 'corporate':
        return homeCareList.filter((homeCare) => homeCare.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return homeCareList.filter((homeCare) => homeCare.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [homeCareList, loginProviderInfo]);
  const userList = useSelector((state) => state.user.userList);
  const homeCareData = selectedHomeCareList.find((homeCare) => homeCare.id === homeCareId);
  const focusTrapRef = useFocusTrap(hasPermit(homeCareData?.status || 0, 'enableEdit'));
  const { isLoading: userLoading } = useGetUserListQuery(undefined);
  const selectedUserList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return userList;
      case 'corporate':
        return userList.filter(
          (user) =>
            (user.is_kazi || user.is_shintai || user.is_tsuin || user.is_with_tsuin) &&
            user.corporate_id === loginProviderInfo.corporate_id
        );
      case 'office':
        return userList.filter(
          (user) =>
            (user.is_kazi || user.is_shintai || user.is_tsuin || user.is_with_tsuin) && user.login_id === loginProviderInfo.id
        );
      default:
        return [];
    }
  }, [userList]);
  const { isLoading: staffLoading } = useGetStaffListQuery(undefined);
  const staffList = useSelector((state) => state.staff.staffList);
  const [createHomeCare] = useCreateHomeCareMutation();
  const [updateHomeCare] = useUpdateHomeCareMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleChangeService,
    handleRefresh,
    kaziAmountTime,
    shintaiAmountTime,
    withTsuinAmountTime,
    tsuinAmountTime,
    recordSubmit,
  }: UseGetHomeCareRecordFormType<CreateHomeCareParams> = useGetHomeCareRecordForm({
    type,
    createInitialState,
    recordData: homeCareData,
    createRecord: createHomeCare,
    updateRecord: updateHomeCare,
    validate,
  });
  const selectedUser = userList.find((user) => user.name === form.values.user_name);
  const selectedStaffList = staffList.filter((staff) => {
    return isQualifiedToProvideService(staff, KYOTAKU, selectedUser);
  });

  const timeObj = { kaziAmountTime, shintaiAmountTime, withTsuinAmountTime, tsuinAmountTime };

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
      router.push(getPath('HOME_CARE'));
    }
  };

  return (
    <Stack>
      <LoadingOverlay visible={type === 'edit' && !homeCareData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper statusId={homeCareData?.status} />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
        {!hasPermit(homeCareData?.status || 0, 'enableEdit') && <Overlay opacity={0.6} color="#fff" zIndex={5} radius="md" />}
        <Paper withBorder shadow="md" p={30} radius="md">
          <HomeCareRecordBasicInfo
            type={type}
            form={form}
            userList={selectedUserList}
            recordList={selectedHomeCareList}
            amountTime={timeObj}
          />
          <Space h="lg" />
          <Divider variant="dotted" />
          <Space h="lg" />
          <HomeCareRecordContentArray
            form={form}
            staffList={selectedStaffList}
            userList={selectedUserList}
            handleChangeDate={handleChangeDate}
            handleChangeService={handleChangeService}
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
