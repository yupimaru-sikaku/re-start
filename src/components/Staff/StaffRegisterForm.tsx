import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, LoadingOverlay, Paper, SegmentedControl, SimpleGrid, Space, Switch, Text } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { CustomTextInput } from 'src/components/Common/CustomTextInput';
import { CustomButton } from 'src/components/Common/CustomButton';
import { getPath } from '@/utils/const/getPath';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox } from '@tabler/icons';
import { createInitialState } from '@/ducks/staff/slice';
import { validate } from '@/utils/validate/staff';
import { CustomConfirm } from '../Common/CustomConfirm';
import { useGetQualificationList } from '@/hooks/staff/useGetQualificationList';
import { NextPage } from 'next';
import { useGetStaffForm } from '@/hooks/form/useGetStaffForm';

type Props = {
  type: 'create' | 'edit';
};

export const StaffRegisterForm: NextPage<Props> = ({ type }) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { form, staffData, recordSubmit } = useGetStaffForm({
    type,
    createInitialState,
    validate: validate,
  });
  const qualificationList = useGetQualificationList(form);

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
      router.push(getPath('STAFF'));
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef} className="relative">
      <LoadingOverlay visible={!staffData} />
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomTextInput
          idText="name"
          label="スタッフ名"
          description="例）リスタート 太郎"
          required={true}
          form={form}
          formValue="name"
        />
        <CustomTextInput
          idText="furigana"
          label="ふりがな"
          description="例）りすたーと たろう"
          required={true}
          form={form}
          formValue="furigana"
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
        <SimpleGrid cols={2}>
          <CustomTextInput
            idText="work_time_per_week"
            label="勤務時間/週"
            description=""
            required={true}
            form={form}
            formValue="work_time_per_week"
          />
          <Text size="sm">時間/月</Text>
        </SimpleGrid>

        <Space h="lg" />

        <Text size="sm">保有している資格</Text>

        <SimpleGrid
          breakpoints={[
            { minWidth: 'sm', cols: 2 },
            { minWidth: 'md', cols: 3 },
            { minWidth: 'xl', cols: 4 },
          ]}
        >
          {qualificationList.map((qualification) => (
            <Box key={qualification.title}>
              <Switch
                label={qualification.title}
                description=""
                size="md"
                onLabel="ON"
                offLabel="OFF"
                checked={qualification.formValue}
                {...form.getInputProps(qualification.formTitle)}
              />
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
