import React, { useState } from 'react';
import Link from 'next/link';
import { createStyles, Paper, Title, Text, Group, Anchor, Center, Box } from '@mantine/core';
import { ArrowLeft } from 'tabler-icons-react';
import { getPath } from '@/utils/const/getPath';
import { useForm } from '@mantine/form';
import { validateEmail } from 'src/utils/validate/common';
import { CustomConfirm } from '../Common/CustomConfirm';
import { CustomButton } from '../Common/CustomButton';
import { useFocusTrap } from '@mantine/hooks';
import { CustomTextInput } from '../Common/CustomTextInput';
import { useResetPasswordForEmailMutation } from '@/ducks/auth/query';

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

export const ForgotPassword = () => {
  const { classes } = useStyles();
  const focusTrapRef = useFocusTrap();
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value: string) => {
        const { error, text } = validateEmail(value);
        return error ? text : null;
      },
    },
  });
  const [resetPasswordForEmail] = useResetPasswordForEmailMutation();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = (await resetPasswordForEmail(form.values.email)) as any;
      if (error) throw new Error('パスワード再設定の処理に失敗しました。');
      setIsFinished(true);
    } catch (err: any) {
      await CustomConfirm(err.message, 'Caution');
    }
    setIsLoading(false);
  };

  return (
    <>
      <Title className={classes.title} align="center">
        {isFinished ? 'メール送信完了' : 'パスワードをお忘れですか？'}
      </Title>
      <Text color="dimmed" size="sm" align="center">
        {isFinished
          ? '入力したアドレスにパスワード変更手続きのメールを送信しました。'
          : 'リセットするためにメールアドレスをご入力ください'}
      </Text>
      {!isFinished && (
        <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
          <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
            <CustomTextInput
              idText="email"
              label="メールアドレス"
              description="例）test@example.com"
              required={true}
              form={form}
              formValue="email"
            />
            <Group position="apart" mt="lg" className={classes.controls}>
              <Link href={getPath('SIGN_IN')} passHref>
                <Anchor<'a'> color="dimmed" size="sm" className={classes.control}>
                  <Center inline>
                    <ArrowLeft size={12} />
                    <Box ml={5}>ログインページに戻る</Box>
                  </Center>
                </Anchor>
              </Link>
              <CustomButton type="submit" fullWidth loading={isLoading}>
                リセットする
              </CustomButton>
            </Group>
          </Paper>
        </form>
      )}
    </>
  );
};
