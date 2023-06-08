import { LoadingOverlay, Paper, Space } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CustomButton } from '../Common/CustomButton';
import { CustomConfirm } from '../Common/CustomConfirm';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { validate } from '@/utils/validate/provider';
import { useGetProviderForm } from '@/hooks/form/useGetProviderForm';
import { createInitialState } from 'src/ducks/provider/slice';
import { CustomTextInput } from '../Common/CustomTextInput';
import { CustomPasswordInput } from '../Common/CustomPasswordInput';

type Props = {
  type: 'create' | 'edit';
};

export const ProviderCreate = ({ type }: Props) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { form, providerData, recordSubmit } = useGetProviderForm({
    type,
    createInitialState,
    validate: validate,
  });

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
      router.push(getPath('PROVIDER'));
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} style={{ position: 'relative' }}>
      <LoadingOverlay visible={type === 'edit' && !providerData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomTextInput
          idText="corporate_name"
          label="法人名"
          description=""
          required={true}
          form={form}
          formValue="corporate_name"
          disabled={true}
        />
        <CustomTextInput
          idText="office_name"
          label="事業所名"
          description="例）リスタート事業所"
          required={true}
          form={form}
          formValue="office_name"
        />
        <CustomTextInput
          idText="email"
          label="メールアドレス"
          description="例）re-start@gmail.com"
          required={true}
          form={form}
          formValue="email"
          disabled={type === 'edit'}
        />
        {type === 'create' && (
          <>
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
          </>
        )}
        <Space h="xl" />
        <CustomButton type="submit" fullWidth loading={isLoading}>
          {TITLE}
        </CustomButton>
      </Paper>
    </form>
  );
};
