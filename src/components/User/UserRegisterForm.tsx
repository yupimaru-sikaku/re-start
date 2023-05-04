import { CreateUserResult, initialState } from '@/ducks/user/slice';
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
import React, { useMemo, useState } from 'react';
import { CustomTextInput } from '../Common/CustomTextInput';
import { useForm } from '@mantine/form';
import { CustomButton } from '../Common/CustomButton';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { validateIdentification, validateName } from '@/utils/validate/user';
import {
  useCreateUserMutation,
  useGetUserListByLoginIdQuery,
  useGetUserListQuery,
} from '@/ducks/user/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { useGetServiceList } from '@/hooks/user/useGetServiceList';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';

export const UserRegisterForm = () => {
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createUser] = useCreateUserMutation();
  const data1 = useGetUserListQuery();
  const data2 = useGetUserListByLoginIdQuery(loginProviderInfo.id || '');
  const { refetch } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!loginProviderInfo.id) return;
      const genderSpecification = form.values.is_gender_specification
        ? form.values.gender_specification
        : '無し';
      const params = {
        ...form.values,
        user_id: loginProviderInfo.id,
        gender_specification: genderSpecification,
      };
      const { error } = (await createUser(params)) as CreateUserResult;

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      await CustomConfirm(
        `利用者の情報登録に失敗しました。${error}`,
        'Caution'
      );
      setIsLoading(false);
      return;
    }
    refetch();
    showNotification({
      icon: <IconCheckbox />,
      message: '登録に成功しました！',
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
          登録
        </CustomButton>
      </Paper>
    </form>
  );
};
