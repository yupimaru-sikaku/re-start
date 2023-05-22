import { createInitialState } from '@/ducks/user/slice';
import { Box, Grid, LoadingOverlay, Paper, SegmentedControl, Select, SimpleGrid, Space, Switch, Text } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CustomTextInput } from '../Common/CustomTextInput';
import { CustomButton } from '../Common/CustomButton';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { validate } from '@/utils/validate/user';
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from '@/ducks/user/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { useGetServiceList } from '@/hooks/user/useGetServiceList';
import { RootState } from '@/ducks/root-reducer';
import { useSelector } from '@/ducks/store';
import { cityList, disabilityTypeList } from '@/utils/user';
import { NextPage } from 'next';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetUserForm } from '@/hooks/form/useGetUserForm';

type Props = {
  type: 'create' | 'edit';
};

export const UserRegisterForm: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { form, userData, recordSubmit } = useGetUserForm({
    type,
    createInitialState,
    validate: validate,
  });

  const serviceList = useGetServiceList(form);

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
      router.push(getPath('USER'));
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} className="relative">
      <LoadingOverlay visible={type === 'edit' && !userData} />
      <Paper withBorder shadow="md" p={30} radius="md">
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
          data={[
            { label: '男性', value: '男性' },
            { label: '女性', value: '女性' },
          ]}
          value={form.values.gender}
          {...form.getInputProps('gender')}
        />
        <SimpleGrid cols={3}>
          <Box>
            <Switch
              label="性別指定"
              description="スタッフの性別指定"
              size="md"
              onLabel="ON"
              offLabel="OFF"
              checked={form.values.is_gender_specification}
              value={form.values.is_gender_specification}
              {...form.getInputProps('is_gender_specification')}
            />
            <SegmentedControl
              id="gender_specification"
              color="blue"
              aria-required
              data={[
                { label: '男性', value: '男性' },
                { label: '女性', value: '女性' },
              ]}
              value={form.values.gender_specification}
              disabled={!form.values.is_gender_specification}
              {...form.getInputProps('gender_specification')}
            />
          </Box>
          <Select
            label="市区町村"
            searchable
            nothingFound="No Data"
            data={cityList.map((city) => city.value)}
            variant="filled"
            {...form.getInputProps('city')}
          />
          <Select
            label="サービスの種別"
            searchable
            nothingFound="No Data"
            data={disabilityTypeList.map((disabilityType) => disabilityType)}
            variant="filled"
            {...form.getInputProps('disability_type')}
          />
        </SimpleGrid>
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
                checked={service.form}
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
        <Space h="xl" />
        <CustomButton type="submit" fullWidth loading={isLoading}>
          {TITLE}
        </CustomButton>
      </Paper>
    </form>
  );
};
