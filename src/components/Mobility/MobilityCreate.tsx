import React, { FC, useMemo, useState } from 'react';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { CustomButton } from 'src/components/Common/CustomButton';
import { CustomStepper } from 'src/components/Common/CustomStepper';
import { RecordBasicInfo } from 'src/components/Common/RecordBasicInfo';
import { RecordContentArray } from 'src/components/Common/RecordContentArray';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { Divider, LoadingOverlay, Overlay, Paper, Space, Stack } from '@mantine/core';
import { CreateMobilityParams, createInitialState } from '@/ducks/mobility/slice';
import { useGetUserListQuery } from '@/ducks/user/query';
import { useCreateMobilityMutation, useUpdateMobilityMutation } from '@/ducks/mobility/query';
import { useGetStaffListQuery } from '@/ducks/staff/query';
import { UseGetRecordFormType, useGetRecordForm } from '@/hooks/form/useGetRecordForm';
import { validate } from '@/utils/validate/mobility';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { useSelector } from '@/ducks/store';
import { useHasPermit } from '@/hooks/form/useHasPermit';
import { IDO } from '@/utils';

type Props = {
  type: 'create' | 'edit';
};

export const MobilityCreate: FC<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const { hasPermit } = useHasPermit();
  const mobilityId = router.query.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const mobilityList = useSelector((state) => state.mobility.mobilityList);
  const selectedMobilityList = useMemo(() => {
    switch (loginProviderInfo.role) {
      case 'admin':
        return mobilityList;
      case 'corporate':
        return mobilityList.filter((mobility) => mobility.corporate_id === loginProviderInfo.corporate_id);
      case 'office':
        return mobilityList.filter((mobility) => mobility.login_id === loginProviderInfo.id);
      default:
        return [];
    }
  }, [mobilityList, loginProviderInfo]);
  const userList = useSelector((state) => state.user.userList);
  const mobilityData = selectedMobilityList.find((mobility) => mobility.id === mobilityId);
  const { isLoading: userLoading } = useGetUserListQuery(undefined);
  const selectedUserList = userList.filter((user) => user.is_ido && user.corporate_id === loginProviderInfo.corporate_id);
  const { isLoading: staffLoading } = useGetStaffListQuery(undefined);
  const staffList = useSelector((state) => state.staff.staffList);
  // TODO：どの資格があればサービスを提供できるか
  const selectedStaffList = staffList.filter((staff) => staff.is_syoninsya);
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
  }: UseGetRecordFormType<CreateMobilityParams> = useGetRecordForm({
    type,
    SERVICE_CONTENT: IDO,
    createInitialState,
    recordData: mobilityData,
    createRecord: createMobility,
    updateRecord: updateMobility,
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
      router.push(getPath('MOBILITY'));
    }
  };

  return (
    <Stack>
      <LoadingOverlay sx={{ position: 'relative' }} visible={type === 'edit' && !mobilityData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper statusId={mobilityData?.status} />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
        {!hasPermit(mobilityData?.status || 0, 'enableEdit') && <Overlay opacity={0.6} color="#fff" zIndex={5} radius="md" />}
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo
            type={type}
            form={form}
            recordList={selectedMobilityList}
            userList={selectedUserList}
            amountTime={amountTime}
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
