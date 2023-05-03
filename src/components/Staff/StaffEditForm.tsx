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
import React, { useEffect, useMemo, useState } from 'react';
import { CustomTextInput } from '../Common/CustomTextInput';
import { useForm } from '@mantine/form';
import { CustomButton } from '../Common/CustomButton';
import { useLoginUser } from '@/libs/mantine/useLoginUser';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import {
  initialState,
  UpdateStaffParams,
  UpdateStaffResult,
} from '@/ducks/staff/slice';
import {
  useGetStaffByIdQuery,
  useGetStaffListByLoginIdQuery,
  useUpdateStaffMutation,
} from '@/ducks/staff/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { skipToken } from '@reduxjs/toolkit/dist/query';

export const StaffEditForm = () => {
  const [updateStaff] = useUpdateStaffMutation();
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const staffId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginUser } = useLoginUser();
  const { data: staffData, refetch: getStaffByIdRefetch } =
    useGetStaffByIdQuery(staffId || skipToken);
  const { refetch: getStaffListRefetch } = useGetStaffListByLoginIdQuery(
    loginUser?.id || ''
  );

  useEffect(() => {
    if (!staffData) return;
    form.setValues(staffData);
  }, [staffData]);
  const form = useForm({
    initialValues: initialState,
    validate: {
      // name: (value) => {
      //   const { error, text } = validateName(value);
      //   return error ? text : null;
      // },
    },
  });
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!staffData || !loginUser) return;
      const params: UpdateStaffParams = {
        id: staffData.id,
        name: form.values.name,
        furigana: form.values.furigana,
        gender: form.values.gender,
        work_time_per_week: form.values.work_time_per_week,
        is_syoninsya: form.values.is_syoninsya,
        is_kodo: form.values.is_kodo,
        is_doko_normal: form.values.is_doko_normal,
        is_doko_apply: form.values.is_doko_apply,
        is_zitsumusya: form.values.is_zitsumusya,
        is_kaigo: form.values.is_kaigo,
        user_id: loginUser.id,
      };

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

  const qualificationList = [
    {
      title: '初任者研修',
      formTitle: 'is_syoninsya',
      formValue: form.values.is_syoninsya,
    },
    {
      title: '行動援護',
      formTitle: 'is_kodo',
      formValue: form.values.is_kodo,
    },
    {
      title: '同行援護一般',
      formTitle: 'is_doko_normal',
      formValue: form.values.is_doko_normal,
    },
    {
      title: '同行援護応用',
      formTitle: 'is_doko_apply',
      formValue: form.values.is_doko_apply,
    },
    {
      title: '実務者研修',
      formTitle: 'is_zitsumusya',
      formValue: form.values.is_zitsumusya,
    },
    {
      title: '介護福祉士',
      formTitle: 'is_kaigo',
      formValue: form.values.is_kaigo,
    },
  ];
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
