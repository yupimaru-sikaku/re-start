import { Divider, LoadingOverlay, Overlay, Paper, Space, Stack } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CustomButton } from '../Common/CustomButton';
import { CustomStepper } from '../Common/CustomStepper';
import { CreateAccompanyParams, createInitialState } from '@/ducks/accompany/slice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import { useCreateAccompanyMutation, useGetAccompanyDataQuery, useUpdateAccompanyMutation } from '@/ducks/accompany/query';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { UseGetFormType, useGetForm } from '@/hooks/form/useGetForm';
import { RecordBasicInfo } from '../Common/RecordBasicInfo';
import { RecordContentArray } from '../Common/RecordContentArray';
import { validate } from '@/utils/validate/accompany';
import { CustomConfirm } from '../Common/CustomConfirm';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { useSelector } from '@/ducks/store';
import { useHasPermit } from '@/hooks/form/useHasPermit';

type Props = {
  type: 'create' | 'edit';
};

export const AccompanyCreate: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const SERVICE_CONTENT = '同行援護';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const { hasPermit } = useHasPermit();
  const accompanyId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accompanyList = useSelector((state) => state.accompany.accompanyList);
  const {
    data: accompanyData,
    isLoading: accompanyLoading,
    refetch: accompanyRefetch,
  } = useGetAccompanyDataQuery(accompanyId || skipToken);
  const { data: userList = [] } = useGetUserListByServiceQuery('is_doko');
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
  }: UseGetFormType<CreateAccompanyParams> = useGetForm({
    type,
    SERVICE_CONTENT,
    createInitialState,
    recordData: accompanyData,
    refetch: accompanyRefetch,
    validate,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await recordSubmit({
      createRecord: createAccompany,
      updateRecord: updateAccompany,
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
      router.push(getPath('ACCOMPANY'));
    }
  };

  return (
    <Stack>
      <LoadingOverlay className="relative" visible={accompanyLoading} />
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
