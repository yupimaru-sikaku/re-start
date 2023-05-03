import {
  Box,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Grid,
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
import { initialState, UpdateUserResult } from '@/ducks/user/slice';
import {
  useGetUserByIdQuery,
  useGetUserListByLoginIdQuery,
  useGetUserListQuery,
  useUpdateUserMutation,
} from '@/ducks/user/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { validateIdentification, validateName } from '@/utils/validate/user';
import { useGetServiceList } from '@/hooks/user/useGetServiceList';

export const UserEditForm = () => {
  const { provider } = useLoginUser();
  const [updateUser] = useUpdateUserMutation();
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const userId = router.query.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginUser } = useLoginUser();
  const { data: userData, refetch: getUserByIdRefetch } = useGetUserByIdQuery(
    userId || skipToken
  );
  const data1 = useGetUserListQuery();
  const data2 = useGetUserListByLoginIdQuery(loginUser?.id || '');
  const {
    refetch,
  } = useMemo(() => {
    if (provider?.role === 'super_admin') {
      return data1;
    } else {
      return data2;
    }
  }, [data1, data2]);

  const form = useForm({
    initialValues: initialState,
    validate: {
      name: (value) => {
        const { error, text } = validateName(value);
        return error ? text : null;
      },
      identification: (value) => {
        const { error, text } = validateIdentification(value);
        return error ? text : null;
      },
    },
  });
  const serviceList = useGetServiceList(form);

  // useFormは再レンダリングされないため、useEffectを使用
  useEffect(() => {
    userData && form.setValues(userData);
  }, [userData]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!userData || !loginUser) return;
      const genderSpecification = form.values.is_gender_specification
        ? form.values.gender_specification
        : '無し';
      const params = {
        ...form.values,
        gender_specification: genderSpecification,
      };

      const { error } = (await updateUser(params)) as UpdateUserResult;

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      await CustomConfirm(
        `利用者の情報更新に失敗しました。${error}`,
        'Caution'
      );
      setIsLoading(false);
      return;
    }
    refetch();
    getUserByIdRefetch();
    showNotification({
      icon: <IconCheckbox />,
      message: '更新に成功しました！',
    });
    router.push(getPath('USER'));
    setIsLoading(false);
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
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
          classNames={{
            root: '',
          }}
          data={[
            { label: '男性', value: '男性' },
            { label: '女性', value: '女性' },
          ]}
          value={form.values.gender}
          {...form.getInputProps('gender')}
        />
        <Switch
          label="性別指定"
          description="スタッフの性別指定。OFFの場合は『指定無し」になります"
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
          更新
        </CustomButton>
      </Paper>
    </form>
  );
};
