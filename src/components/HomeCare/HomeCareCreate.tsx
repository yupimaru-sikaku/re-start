import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
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
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import { useHasPermit } from '@/hooks/form/useHasPermit';
import { useGetStaffListByServiceQuery } from '@/ducks/staff/query';
import { useCreateHomeCareMutation, useUpdateHomeCareMutation } from '@/ducks/home-care/query';
import { UseGetHomeCareRecordFormType, useGetHomeCareRecordForm } from '@/hooks/form/useGetHomeCareRecordForm';
import { HomeCareRecordBasicInfo } from './HomeCareRecordBasicInfo';
import { HomeCareRecordContentArray } from './HomeCareRecordContentArray';

type Props = {
  type: 'create' | 'edit';
};

export const HomeCareCreate: FC<Props> = ({ type }: Props) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const SERVICE_CONTENT = '居宅介護';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const homeCareId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { hasPermit } = useHasPermit();
  const loginProviderInfo = useSelector((state: RootState) => state.provider.loginProviderInfo);
  const homeCareList = useSelector((state) => state.homeCare.homeCareList);
  const homeCareData = homeCareList.find((homeCare) => homeCare.id === homeCareId);
  const { data: userList = [] } = useGetUserListByServiceQuery(
    {
      corporateId: loginProviderInfo.corporate_id,
      serviceName: 'is_kyotaku',
    },
    { refetchOnMountOrArgChange: true }
  );
  const { data: staffList = [] } = useGetStaffListByServiceQuery('kyotaku', { refetchOnMountOrArgChange: true });
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
      <LoadingOverlay sx={{ position: 'relative' }} visible={type === 'edit' && !homeCareData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper statusId={homeCareData?.status} />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
        {!hasPermit(homeCareData?.status || 0, 'enableEdit') && <Overlay opacity={0.6} color="#fff" zIndex={5} radius="md" />}
        <Paper withBorder shadow="md" p={30} radius="md">
          <HomeCareRecordBasicInfo type={type} form={form} recordList={homeCareList} amountTime={timeObj} />
          <Space h="lg" />
          <Divider variant="dotted" />
          <Space h="lg" />
          <HomeCareRecordContentArray
            form={form}
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
