import React, { useState } from 'react';
import { createStyles, Paper, Title, Text, Space } from '@mantine/core';
import { CustomPasswordInput } from '../Common/CustomPasswordInput';
import { useRouter } from 'next/router';
import { useFocusTrap } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { validatePassword } from '@/utils/validate/provider';
import { CustomButton } from '../Common/CustomButton';
import { useResetPasswordMutation } from '@/ducks/auth/query';
import { CustomConfirm } from '../Common/CustomConfirm';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}));

export const ResetPassword = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const focusTrapRef = useFocusTrap();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      password: '',
      password_confirmation: '',
    },
    validate: {
      password: (value) => {
        const { error, text } = validatePassword(value);
        return error ? text : null;
      },
      password_confirmation: (value: string, values) => value !== values.password && 'パスワードが一致しません',
    },
  });
  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = (await resetPassword(form.values.password)) as any;
      if (error) throw new Error('パスワード再設定の処理に失敗しました。');
      showNotification({
        icon: <IconCheckbox />,
        message: 'パスワードの再設定に成功しました。',
      });
      router.push(getPath('SIGN_IN'));
    } catch (err: any) {
      await CustomConfirm(err.message, 'Caution');
    }
    setIsLoading(false);
  };

  return (
    <>
      <Title className={classes.title} align="center">
        パスワードリセット
      </Title>
      <Text color="dimmed" size="sm" align="center">
        リセットするためにメールアドレスをご入力ください
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <CustomPasswordInput
            idText="password"
            label="パスワード"
            description="半角英数字8文字以上"
            required={true}
            form={form}
            formValue="password"
          />
          <CustomPasswordInput
            idText="password_confirmation"
            label="パスワード（確認用）"
            description="半角英数字8文字以上"
            required={true}
            form={form}
            formValue="password_confirmation"
          />
          <Space h="xl" />
          <CustomButton type="submit" fullWidth loading={isLoading}>
            パスワード再設定
          </CustomButton>
        </Paper>
      </form>
    </>
  );
};
