import {
  Box,
  LoadingOverlay,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Space,
  Switch,
  Text,
} from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CustomTextInput } from '../Common/CustomTextInput';
import { useForm } from '@mantine/form';
import { CustomButton } from '../Common/CustomButton';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import {
  CreateStaffParams,
  CreateStaffResult,
  UpdateStaffParams,
  createInitialState,
} from '@/ducks/staff/slice';
import {
  validateFurigana,
  validateName,
  validateWorkTimePerWeek,
} from '@/utils/validate/staff';
import {
  useCreateStaffMutation,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
} from '@/ducks/staff/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { useGetQualificationList } from '@/hooks/staff/useGetQualificationList';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { NextPage } from 'next';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { UpdateStaffResult } from '@/ducks/staff/slice';

type Props = {
  type: 'create' | 'edit';
};

export const StaffRegisterForm: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const staffId = router.query.id as string;
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    data: staffData,
    isLoading: staffDataLoading,
    refetch: staffDataRefetch,
  } = useGetStaffByIdQuery(staffId || skipToken);
  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const form = useForm({
    initialValues: createInitialState,
    validate: {
      name: (value) => {
        const { error, text } = validateName(value);
        return error ? text : null;
      },
      furigana: (value) => {
        const { error, text } = validateFurigana(value);
        return error ? text : null;
      },
      work_time_per_week: (value) => {
        const { error, text } = validateWorkTimePerWeek(value);
        return error ? text : null;
      },
    },
  });
  useEffect(() => {
    if (!staffData) return;
    staffDataRefetch();
    form.setValues(staffData);
  }, [staffData]);
  const qualificationList = useGetQualificationList(form);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (type === 'create') {
        const params: CreateStaffParams = {
          ...form.values,
          login_id: loginProviderInfo.id,
        };
        const { error } = (await createStaff(
          params
        )) as CreateStaffResult;
        if (error) {
          throw new Error(error.message);
        }
      } else {
        const params: UpdateStaffParams = {
          ...form.values,
          id: staffId,
          login_id: loginProviderInfo.id,
        };
        const { error } = (await updateStaff(
          params
        )) as UpdateStaffResult;
        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      await CustomConfirm(
        `スタッフの${TITLE}に失敗しました。${error}`,
        'Caution'
      );
      setIsLoading(false);
      return;
    }
    showNotification({
      icon: <IconCheckbox />,
      message: `${TITLE}に成功しました！`,
    });
    router.push(getPath('STAFF'));
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      ref={focusTrapRef}
      className="relative"
    >
      <LoadingOverlay visible={staffDataLoading} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomTextInput
          idText="name"
          label="スタッフ名"
          description="例）リスタート 太郎"
          required={true}
          form={form}
          formValue="name"
        />
        <CustomTextInput
          idText="furigana"
          label="ふりがな"
          description="例）りすたーと たろう"
          required={true}
          form={form}
          formValue="furigana"
        />
        <Text size="sm">
          性別
          <Text span color="red">
            {' '}
            *
          </Text>
        </Text>
        <SegmentedControl
          id="gender"
          color="blue"
          aria-required
          classNames={{
            root: '',
          }}
          data={[
            { label: '男性', value: '男性' },
            { label: '女性', value: '女性' },
          ]}
          {...form.getInputProps('gender')}
        />
        <SimpleGrid cols={2}>
          <CustomTextInput
            idText="work_time_per_week"
            label="勤務時間/週"
            description=""
            required={true}
            form={form}
            formValue="work_time_per_week"
          />
          <Text size="sm">時間/月</Text>
        </SimpleGrid>

        <Space h="lg" />

        <Text size="sm">保有している資格</Text>

        <SimpleGrid
          breakpoints={[
            { minWidth: 'sm', cols: 2 },
            { minWidth: 'md', cols: 3 },
            { minWidth: 'xl', cols: 4 },
          ]}
        >
          {qualificationList.map((qualification) => (
            <Box key={qualification.title}>
              <Switch
                label={qualification.title}
                description=""
                size="md"
                onLabel="ON"
                offLabel="OFF"
                checked={qualification.formValue}
                {...form.getInputProps(qualification.formTitle)}
              />
            </Box>
          ))}
        </SimpleGrid>
        <Space h="xl" />
        <CustomButton type="submit" fullWidth loading={isLoading}>
          登録
        </CustomButton>
      </Paper>
    </form>
  );
};
