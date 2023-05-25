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
import { CreateMobilityParams, createInitialState } from '@/ducks/mobility/slice';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import { useCreateMobilityMutation, useUpdateMobilityMutation } from '@/ducks/mobility/query';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { UseGetRecordFormType, useGetRecordForm } from '@/hooks/form/useGetRecordForm';
import { validate } from '@/utils/validate/mobility';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { useSelector } from '@/ducks/store';
import { useHasPermit } from '@/hooks/form/useHasPermit';

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
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const { hasPermit } = useHasPermit();
  const mobilityList = useSelector((state) => state.mobility.mobilityList);
  const mobilityData = mobilityList.find((mobility) => mobility.id === mobilityId);
  const { data: userList = [] } = useGetUserListByServiceQuery({
    corporateId: loginProviderInfo.corporate_id,
    serviceName: 'is_ido',
  });
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
  }: UseGetRecordFormType<CreateMobilityParams> = useGetRecordForm({
    type,
    SERVICE_CONTENT,
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
      <LoadingOverlay className="relative" visible={type === 'edit' && !mobilityData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper statusId={mobilityData?.status} />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
        {!hasPermit(mobilityData?.status || 0, 'enableEdit') && <Overlay opacity={0.6} color="#fff" zIndex={5} radius="md" />}
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo type={type} form={form} recordList={mobilityList} amountTime={amountTime} />
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
