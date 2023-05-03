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
import React, { useState } from 'react';
import { CustomTextInput } from '../Common/CustomTextInput';
import { useForm } from '@mantine/form';
import { CustomButton } from '../Common/CustomButton';
import { useLoginUser } from '@/libs/mantine/useLoginUser';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { CreateStaffResult, initialState } from '@/ducks/staff/slice';
import {
  validateFurigana,
  validateName,
  validateWorkTimePerWeek,
} from '@/utils/validate/staff';
import {
  useCreateStaffMutation,
  useGetStaffListQuery,
} from '@/ducks/staff/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { useGetQualificationList } from '@/hooks/staff/useGetQualificationList';

export const StaffRegisterForm = () => {
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createStaff] = useCreateStaffMutation();
  const { refetch } = useGetStaffListQuery();
  const { loginUser } = useLoginUser();
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!loginUser) return;
      const params = { ...form.values, user_id: loginUser!.id };
      const { error } = (await createStaff(params)) as CreateStaffResult;

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      await CustomConfirm(
        `スタッフの情報登録に失敗しました。${error}`,
        'Caution'
      );
      setIsLoading(false);
      return;
    }
    showNotification({
      icon: <IconCheckbox />,
      message: '登録に成功しました！',
    });
    refetch();
    router.push(getPath('STAFF'));
    setIsLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
