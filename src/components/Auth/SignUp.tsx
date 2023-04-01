import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { Anchor, Paper, Title, Text, Space } from '@mantine/core';
import { getPath } from '@/utils/const/getPath';
import { AuthLayout } from 'src/components/Layout/AuthLayout/AuthLayout';
import { useForm } from '@mantine/form';
import { initialState, Provider } from 'src/ducks/provider/slice';
import { useFocusTrap } from '@mantine/hooks';
import { CustomTextInput } from 'src/components/Common/CustomTextInput';
import { CustomPasswordInput } from '../Common/CustomPasswordInput';
import { CustomButton } from 'src/components/Common/CustomButton';
import { supabase } from 'src/libs/supabase/supabase';
import {
  validateCorporateName,
  validateOfficeName,
  validatePassword,
} from '@/utils/validate/provider';
import { validateEmail } from 'src/utils/validate/common';
import { useRouter } from 'next/router';

export const SignUp = () => {
  const router = useRouter();
  const focusTrapRef = useFocusTrap();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: initialState,
    validate: {
      corporateName: (value) => {
        const { error, text } = validateCorporateName(value);
        return error ? text : null;
      },
      officeName: (value) => {
        const { error, text } = validateOfficeName(value);
        return error ? text : null;
      },
      email: (value) => {
        const { error, text } = validateEmail(value);
        return error ? text : null;
      },
      password: (value) => {
        const { error, text } = validatePassword(value);
        return error ? text : null;
      },
      passwordConfirmation: (value: string, values: Provider) =>
        value !== values.password && 'パスワードが一致しません',
    },
    // },
  });

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      // ユーザー登録
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: form.values.email,
          password: form.values.password,
        });
      if (!signUpData.user || signUpError) {
        alert('ユーザ情報の登録に失敗しました。');
        setIsLoading(false);
        return;
      }
      // 法人登録
      const { error: createProviderError } = await supabase
        .from('providers')
        .update({
          corporate_name: form.values.corporateName,
          office_name: form.values.officeName,
        })
        .eq('id', signUpData.user.id);
      if (createProviderError) {
        alert('法人情報の登録に失敗しました。');
        setIsLoading(false);
        return;
      }
      router.push(getPath('CONFIRM_EMAIL'));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }, [form]);

  return (
    <AuthLayout>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        新規登録
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        アカウントを既にお持ちですか？{' '}
        <Link href={getPath('SIGN_IN')} passHref>
          <Anchor<'a'> size="sm">ログイン</Anchor>
        </Link>
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <CustomTextInput
            idText="corporateName"
            label="法人名"
            description="例）株式会社リスタート"
            required={true}
            form={form}
            formValue="corporateName"
          />
          <CustomTextInput
            idText="officeName"
            label="事業所"
            description="例）リスタート事業所"
            required={true}
            form={form}
            formValue="officeName"
          />
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
          <CustomPasswordInput
            idText="passwordConfirmation"
            label="パスワード（確認用）"
            description="半角英数字8文字以上"
            required={true}
            form={form}
            formValue="passwordConfirmation"
          />
          <Space h="xl" />
          <CustomButton type="submit" fullWidth loading={isLoading}>
            新規登録
          </CustomButton>
        </Paper>
      </form>
    </AuthLayout>
  );
};
