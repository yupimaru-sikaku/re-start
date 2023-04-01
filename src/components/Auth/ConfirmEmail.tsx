import React from 'react';
import { Title, Text } from '@mantine/core';
import { AuthLayout } from 'src/components/Layout/AuthLayout/AuthLayout';

export const ConfirmEmail = () => {
  return (
    <AuthLayout>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Eメール認証
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        アカウントを有効化するためには、Eメール認証が必要です。
        <br />
        認証用のリンクをお送りしましたので、ご確認ください。
        <br />
        メールが届いていない場合は、迷惑メールフォルダをご確認ください。
      </Text>
    </AuthLayout>
  );
};
