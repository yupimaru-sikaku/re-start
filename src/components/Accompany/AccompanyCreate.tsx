import { Divider, LoadingOverlay, Paper, Space, Stack } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { CustomButton } from '../Common/CustomButton';
import { CustomStepper } from '../Common/CustomStepper';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import {
  CreateAccompanyParams,
  createInitialState,
} from '@/ducks/accompany/slice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import {
  useCreateAccompanyMutation,
  useGetAccompanyDataQuery,
  useUpdateAccompanyMutation,
} from '@/ducks/accompany/query';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import {
  useCreateScheduleMutation,
  useGetScheduleListQuery,
  useUpdateScheduleMutation,
} from '@/ducks/schedule/query';
import { UseGetFormType, useGetForm } from '@/hooks/form/useGetForm';
import { RecordBasicInfo } from '../Common/RecordBasicInfo';
import { RecordContentArray } from '../Common/RecordContentArray';
import { validate } from '@/utils/validate/accompany';
import { submit } from '@/hooks/form/submit';
import { excludingSelected } from '@/utils';

type Props = {
  type: 'create' | 'edit';
};

export const AccompanyCreate: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const accompanyId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const accompanyList = useSelector(
    (state: RootState) => state.accompany.accompanyList
  );
  const {
    data: accompanyData,
    isLoading: accompanyLoading,
    refetch: accompanyRefetch,
  } = useGetAccompanyDataQuery(accompanyId || skipToken);
  const { data: userList = [] } = useGetUserListByServiceQuery('is_doko');
  const { data: staffList = [] } = useGetStaffListByServiceQuery('doko');
  // TODO: 作成・更新の時のみ呼び出すようにしたい
  const { data: scheduleList = [], refetch: scheduleRefetch } =
    useGetScheduleListQuery();
  const [createAccompany] = useCreateAccompanyMutation();
  const [updateAccompany] = useUpdateAccompanyMutation();
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
  }: UseGetFormType<CreateAccompanyParams> = useGetForm(
    createInitialState,
    accompanyData,
    accompanyRefetch,
    validate
  );

  const userListExcludingSelected = useMemo(() => {
    return excludingSelected(userList, accompanyList, form);
  }, [userList, accompanyList, form.values.year, form.values.month]);

  const selectedUser = userList.find((user) => user.name === form.values.name);

  const handleSubmit = async () => {
    submit({
      setIsLoading: setIsLoading,
      type,
      TITLE,
      SERVICE_CONTENT: '同行援護',
      PATH: 'ACCOMPANY',
      form: form,
      selectedUser: selectedUser,
      loginProviderInfo: loginProviderInfo,
      creteRecord: createAccompany,
      updateRecord: updateAccompany,
      recordData: accompanyData,
      createSchedule,
      updateSchedule,
      router,
      staffList,
      scheduleList,
      scheduleRefetch,
    });
  };

  return (
    <Stack>
      <LoadingOverlay className="relative" visible={accompanyLoading} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <RecordBasicInfo
            type={type}
            form={form}
            userList={userListExcludingSelected}
            selectedUser={selectedUser}
            amountTime={amountTime}
          />
          <Space h="lg" />
          <Divider variant="dotted" />
          <Space h="lg" />
          <RecordContentArray
            form={form}
            handleChangeDate={handleChangeDate}
            handleChangeTime={handleChangeTime}
            staffList={staffList}
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
