import React, { FC, useState } from 'react';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { CustomButton } from 'src/components/Common/CustomButton';
import { CustomStepper } from 'src/components/Common/CustomStepper';
import { RecordBasicInfo } from 'src/components/Common/RecordBasicInfo';
import { RecordContentArray } from 'src/components/Common/RecordContentArray';
import { CustomConfirm } from 'src/components/Common/CustomConfirm';
import { Divider, LoadingOverlay, Overlay, Paper, Space, Stack } from '@mantine/core';
import { CreateAccompanyParams, createInitialState } from '@/ducks/accompany/slice';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import { useCreateAccompanyMutation, useUpdateAccompanyMutation } from '@/ducks/accompany/query';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { UseGetRecordFormType, useGetRecordForm } from '@/hooks/form/useGetRecordForm';
import { validate } from '@/utils/validate/accompany';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { useSelector } from '@/ducks/store';
import { useHasPermit } from '@/hooks/form/useHasPermit';

type Props = {
  type: 'create' | 'edit';
};

export const AccompanyCreate: FC<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const SERVICE_CONTENT = '同行援護';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const accompanyId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { hasPermit } = useHasPermit();
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const accompanyList = useSelector((state) => state.accompany.accompanyList);
  const accompanyData = accompanyList.find((accompany) => accompany.id === accompanyId);
  const { data: userList = [] } = useGetUserListByServiceQuery({
    corporateId: loginProviderInfo.corporate_id,
    serviceName: 'is_doko',
  });
  const { data: staffList = [] } = useGetStaffListByServiceQuery('doko');
  const [createAccompany] = useCreateAccompanyMutation();
  const [updateAccompany] = useUpdateAccompanyMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
    recordSubmit,
  }: UseGetRecordFormType<CreateAccompanyParams> = useGetRecordForm({
    type,
    SERVICE_CONTENT,
    createInitialState,
    recordData: accompanyData,
    createRecord: createAccompany,
    updateRecord: updateAccompany,
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
      router.push(getPath('ACCOMPANY'));
    }
  };

  return (
    <Stack>
      <LoadingOverlay className="relative" visible={type === 'edit' && !accompanyData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper statusId={accompanyData?.status} />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
        {!hasPermit(accompanyData?.status || 0, 'enableEdit') && <Overlay opacity={0.6} color="#fff" zIndex={5} radius="md" />}
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo type={type} form={form} recordList={accompanyList} amountTime={amountTime} />
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
