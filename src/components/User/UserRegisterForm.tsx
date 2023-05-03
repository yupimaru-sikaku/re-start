import { initialState } from '@/ducks/user/slice';
import {
  Box,
  Grid,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Switch,
  Text,
} from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CustomTextInput } from '../Common/CustomTextInput';
import { useForm } from '@mantine/form';
import { CustomButton } from '../Common/CustomButton';
import { supabase } from '@/libs/supabase/supabase';
import { useLoginUser } from '@/libs/mantine/useLoginUser';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import {
  validateGenderSpecification,
  validateIdentification,
  validateName,
} from '@/utils/validate/user';

export const UserRegisterForm = () => {
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginUser } = useLoginUser();
  const form = useForm({
    initialValues: { ...initialState, isGenderSpecification: false },
    validate: {
      name: (value) => {
        const { error, text } = validateName(value);
        return error ? text : null;
      },
      identification: (value) => {
        const { error, text } = validateIdentification(value);
        return error ? text : null;
      },
      gender_specification: (
        value: string,
        values: { isGenderSpecification: boolean }
      ) => {
        const { error, text } = validateGenderSpecification(value);
        return values.isGenderSpecification && error ? text : null;
      },
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const genderSpecification = form.values.isGenderSpecification
        ? form.values.gender_specification
        : '無し';
      const { error } = await supabase.from('users').insert({
        user_id: loginUser?.id,
        name: form.values.name,
        identification: form.values.identification,
        gender: form.values.gender,
        gender_specification: genderSpecification,
        is_ido: form.values.is_ido,
        ido_amount: form.values.ido_amount,
        is_kodo: form.values.is_kodo,
        kodo_amount: form.values.kodo_amount,
        is_doko: form.values.is_doko,
        doko_amount: form.values.doko_amount,
        is_kazi: form.values.is_kazi,
        kazi_amount: form.values.kazi_amount,
        is_shintai: form.values.is_shintai,
        shintai_amount: form.values.shintai_amount,
        is_with_tsuin: form.values.is_with_tsuin,
        with_tsuin_amount: form.values.with_tsuin_amount,
        is_tsuin: form.values.is_tsuin,
        tsuin_amount: form.values.tsuin_amount,
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
    router.push(getPath('USER'));
    setIsLoading(false);
  };

  const serviceList = [
    {
      title: '移動支援',
      formTitle: 'is_ido',
      formValue: 'ido_amount',
      form: form.values.is_ido,
    },
    {
      title: '行動援護',
      formTitle: 'is_kodo',
      formValue: 'kodo_amount',
      form: form.values.is_kodo,
    },
    {
      title: '同行援護',
      formTitle: 'is_doko',
      formValue: 'doko_amount',
      form: form.values.is_doko,
    },
    {
      title: '家事援助',
      formTitle: 'is_kazi',
      formValue: 'kazi_amount',
      form: form.values.is_kazi,
    },
    {
      title: '身体介護',
      formTitle: 'is_shintai',
      formValue: 'shintai_amount',
      form: form.values.is_shintai,
    },
    {
      title: '通院等介助（伴う）',
      formTitle: 'is_with_tsuin',
      formValue: 'with_tsuin_amount',
      form: form.values.is_with_tsuin,
    },
    {
      title: '通院等介助（伴わない）',
      formTitle: 'is_tsuin',
      formValue: 'tsuin_amount',
      form: form.values.is_tsuin,
    },
  ];
  return (
    <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <CustomTextInput
          idText="name"
          label="利用者名"
          description="例）リスタート 太郎"
          required={true}
          form={form}
          formValue="name"
        />
        <CustomTextInput
          idText="identification"
          label="受給者証番号"
          description="10桁の番号"
          required={true}
          form={form}
          formValue="identification"
          maxLength={10}
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
        <Switch
          label="性別指定"
          description="スタッフの性別指定。OFFの場合は『指定無し」になります"
          size="md"
          onLabel="ON"
          offLabel="OFF"
          {...form.getInputProps('isGenderSpecification')}
        />
        <SegmentedControl
          id="gender_specification"
          color="blue"
          aria-required
          classNames={{
            root: '',
          }}
          data={[
            { label: '男性', value: '男性' },
            { label: '女性', value: '女性' },
          ]}
          disabled={!form.values.isGenderSpecification}
          {...form.getInputProps('gender_specification')}
        />
        <SimpleGrid
          breakpoints={[
            { minWidth: 'sm', cols: 2 },
            { minWidth: 'md', cols: 3 },
            { minWidth: 'xl', cols: 4 },
          ]}
        >
          {serviceList.map((service) => (
            <Box key={service.title}>
              <Switch
                label={service.title}
                description=""
                size="md"
                onLabel="ON"
                offLabel="OFF"
                {...form.getInputProps(service.formTitle)}
              />
              <Grid align="center" gutter="xs">
                <Grid.Col span={3}>
                  <CustomTextInput
                    idText={service.formValue}
                    label=""
                    description=""
                    required={true}
                    form={form}
                    formValue={service.formValue}
                    disabled={!service.form}
                    maxLength={2}
                  />
                </Grid.Col>
                <Grid.Col span={5}>
                  <Text size="sm">時間/月</Text>
                </Grid.Col>
              </Grid>
            </Box>
          ))}
        </SimpleGrid>

        <CustomButton type="submit" fullWidth loading={isLoading}>
          登録
        </CustomButton>
      </Paper>
    </form>
  );
};
