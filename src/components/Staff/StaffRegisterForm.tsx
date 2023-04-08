import {
  Box,
  Grid,
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
import { getDb, supabase } from '@/libs/supabase/supabase';
import { useAuth } from '@/libs/mantine/useAuth';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
// import { validateName } from '@/utils/validate/user';
import { initialState } from '@/ducks/staff/slice';

export const StaffRegisterForm = () => {
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const form = useForm({
    initialValues: { ...initialState },
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
      //   const genderSpecification = form.values.isGenderSpecification
      //     ? form.values.gender_specification
      //     : '無し';
      const { error } = await supabase.from(getDb('STAFF')).insert({
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
        user_id: user?.id,
      });

      if (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.log(err);
      return;
    }
    showNotification({
      icon: <IconCheckbox />,
      message: '登録に成功しました！',
    });
    router.push(getPath('STAFF'));
    setIsLoading(false);
  };

  const qualificationList = [
    {
      title: '初任者研修',
      formTitle: 'is_syoninsya',
    },
    {
      title: '行動援護',
      formTitle: 'is_kodo',
    },
    {
      title: '同行援護一般',
      formTitle: 'is_doko_normal',
    },
    {
      title: '同行援護応用',
      formTitle: 'is_doko_apply',
    },
    {
      title: '実務者研修',
      formTitle: 'is_zitsumusya',
    },
    {
      title: '介護福祉士',
      formTitle: 'is_kaigo',
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
