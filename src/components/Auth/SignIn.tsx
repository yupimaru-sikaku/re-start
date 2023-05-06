import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Anchor,
  Paper,
  Title,
  Text,
  Group,
  Checkbox,
  Space,
} from '@mantine/core';
import { getPath } from '@/utils/const/getPath';
import { AuthLayout } from 'src/components/Layout/AuthLayout/AuthLayout';
import { useForm } from '@mantine/form';
import {
  LoginResult,
  loginInitialState,
} from 'src/ducks/provider/slice';
import { useFocusTrap } from '@mantine/hooks';
import { CustomTextInput } from 'src/components/Common/CustomTextInput';
import { CustomPasswordInput } from '../Common/CustomPasswordInput';
import { CustomButton } from 'src/components/Common/CustomButton';
import { supabase } from 'src/libs/supabase/supabase';
import { validateEmail } from '@/utils/validate/common';
import { useRouter } from 'next/router';
import { IconCheck } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import {
  useGetProviderByIdQuery,
  useLoginMutation,
} from '@/ducks/provider/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { useAppDispatch } from '@/ducks/store';
import { skipToken } from '@reduxjs/toolkit/dist/query';

export const SignIn = () => {
  const [id, setId] = useState('');
  const [corporateId, setCorporateId] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [officeName, setOfficeName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('corpoate');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const focusTrapRef = useFocusTrap();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: loginInitialState,
    validate: {
      email: (value) => {
        const { error, text } = validateEmail(value);
        return error ? text : null;
      },
    },
  });
  const [login] = useLoginMutation();

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      // ログイン
      const params = form.values;
      const { data, error } = (await login(params)) as LoginResult;
      //{session: {...}, user: {...}}
      // user: {id}
      if (error) {
        throw new Error(
          'Eメールアドレスかパスワードが間違っています'
        );
      }
      // const loginProviderParams = {
      //   id: data.user.id,
      //   email: data.user.email,
      // };
      // dispatch(setLoginProviderInfo(loginProviderParams));
      showNotification({
        icon: <IconCheck />,
        message: 'ログインに成功しました！',
      });
      router.push(getPath('INDEX'));
    } catch (error: any) {
      await CustomConfirm(error.message, 'Caution');
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }, [form]);

  return (
    <AuthLayout title="ログイン">
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        ログイン
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        アカウントをお持ちでないですか？{' '}
        <Link href={getPath('SIGN_UP')} passHref>
          <Anchor<'a'> size="sm">新規登録</Anchor>
        </Link>
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <CustomTextInput
            idText="email"
            label="メールアドレス"
            description="例）re-start@gmail.com"
            required={true}
            form={form}
            formValue="email"
          />
          <CustomPasswordInput
            idText="password"
            label="パスワード"
            description="半角英数字8文字以上"
            required={true}
            form={form}
            formValue="password"
          />
          <Group position="apart" mt="md">
            <Checkbox label="ログイン状態を保持" />
            <Link href={getPath('FORGOT_PASSWORD')} passHref>
              <Anchor<'a'> size="sm">
                パスワードをお忘れですか？
              </Anchor>
            </Link>
          </Group>
          <Space h="xs" />
          <CustomButton type="submit" fullWidth loading={isLoading}>
            ログイン
          </CustomButton>
        </Paper>
      </form>
    </AuthLayout>
  );
};
