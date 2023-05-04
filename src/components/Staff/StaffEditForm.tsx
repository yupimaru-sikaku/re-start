import {
  Box,
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
import { initialState, UpdateStaffResult } from '@/ducks/staff/slice';
import {
  useGetStaffByIdQuery,
  useGetStaffListQuery,
  useUpdateStaffMutation,
} from '@/ducks/staff/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  validateFurigana,
  validateName,
  validateWorkTimePerWeek,
} from '@/utils/validate/staff';
import { useGetQualificationList } from '@/hooks/staff/useGetQualificationList';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';

export const StaffEditForm = () => {
  const [updateStaff] = useUpdateStaffMutation();
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const staffId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: staffData, refetch: getStaffByIdRefetch } =
    useGetStaffByIdQuery(staffId || skipToken);
  const { refetch: getStaffListRefetch } = useGetStaffListQuery();
  const form = useForm({
    initialValues: initialState,
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
  const qualificationList = useGetQualificationList(form);
  // useFormは再レンダリングされないため
  useEffect(() => {
    if (!staffData) return;
    form.setValues(staffData);
  }, [staffData]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!staffData || !loginProviderInfo.id) return;
      const params = form.values;
      const { error } = (await updateStaff(params)) as UpdateStaffResult;

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      await CustomConfirm(
        `スタッフの情報更新に失敗しました。${error}`,
        'Caution'
      );
      setIsLoading(false);
      return;
    }
    getStaffListRefetch();
    getStaffByIdRefetch();
    showNotification({
      icon: <IconCheckbox />,
      message: '更新に成功しました！',
    });
    router.push(getPath('STAFF'));
    setIsLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
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
          更新
        </CustomButton>
      </Paper>
    </form>
  );
};
