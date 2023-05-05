import { initialState } from '@/ducks/accompanying-support/slice';
import { User } from '@/ducks/user/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { calcWorkTime, convertWeekItem } from '@/utils';
import { getPath } from '@/utils/const/getPath';
import {
  validateMonth,
  validateName,
  validateYear,
} from '@/utils/validate/home-care';
import {
  Divider,
  Grid,
  Paper,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { TimeRangeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useFocusTrap } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox, IconClock } from '@tabler/icons';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CustomButton } from '../Common/CustomButton';
import { CustomConfirm } from '../Common/CustomConfirm';
import { CustomStepper } from '../Common/CustomStepper';
import { CustomTextInput } from '../Common/CustomTextInput';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';

type Props = {
  userList: User[];
};

export const AccompanyingSupportCreate: NextPage<Props> = ({
  userList,
}) => {
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const userNameList = (userList || []).map((user) => user.name);
  const currentDate = new Date();
  const form = useForm({
    initialValues: {
      ...initialState,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      content_arr: Array.from(
        { length: 40 },
        () => initialState.content_arr[0]
      ),
    },
    validate: {
      year: (value) => {
        const { error, text } = validateYear(value);
        return error ? text : null;
      },
      month: (value) => {
        const { error, text } = validateMonth(value);
        return error ? text : null;
      },
      name: (value) => {
        const { error, text } = validateName(value);
        return error ? text : null;
      },
    },
  });
  const man = userList.filter(
    (user) => user.name === form.values.name
  )[0];
  const dokoAmount = form.values.content_arr.reduce(
    (sum, content) =>
      sum +
      Number(
        calcWorkTime(
          new Date(content.start_time!),
          new Date(content.end_time!)
        )
      ),
    0
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    const isOK = await CustomConfirm(
      '実績記録票を作成しますか？後から修正は可能です。',
      '確認画面'
    );
    if (!isOK) {
      setIsLoading(false);
      return;
    }
    // データ整形（空欄がある場合に無視、日付順にソート）
    const formatArr = form.values.content_arr
      .filter((content) => {
        return (
          content.work_date &&
          content.service_content !== '' &&
          content.start_time &&
          content.end_time
        );
      })
      .sort((a, b) => a.work_date! - b.work_date!);
    if (formatArr.length === 0) {
      await CustomConfirm(
        '記録は、少なくとも一行は作成ください。',
        'Caution'
      );
      return;
    }
    try {
      const { error } = await supabase
        .from(getDb('ACCOMPANYING'))
        .insert({
          year: form.values.year,
          month: form.values.month,
          name: form.values.name,
          identification: man.identification,
          amount_title: '同行（初任者等）',
          amount_value: man.doko_amount,
          content_arr: formatArr,
          status: 0,
          user_id: loginProviderInfo.id,
        });
      showNotification({
        icon: <IconCheckbox />,
        message: '登録に成功しました！',
      });
      router.push(getPath('ACCOMPANYING_SUPPPORT'));

      console.log(error);
      if (error) {
        alert('実績記録表の登録に失敗しました。');
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const handleChangeDate = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newContentArr = form.values.content_arr.map(
      (content, contentIndex) => {
        return contentIndex === index
          ? {
              ...content,
              work_date: Number(e.target.value),
              service_content: `${
                e.target.value !== '' ? '同行（初任者等）' : ''
              }`,
            }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };

  const handleChangeTime = (
    start_time: Date,
    end_time: Date,
    index: number
  ) => {
    if (!start_time || !end_time) return;
    const newContentArr = (form.values.content_arr || []).map(
      (content, contentIndex) => {
        const formatStartTime = start_time.toString();
        const formatEndTime = end_time.toString();
        return contentIndex === index
          ? {
              ...content,
              start_time: formatStartTime,
              end_time: formatEndTime,
            }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };

  return (
    <Stack>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <CustomStepper />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <SimpleGrid cols={4}>
            <CustomTextInput
              idText="year"
              label="西暦"
              description=""
              required={true}
              form={form}
              formValue="year"
              minLength={4}
              maxLength={4}
            />
            <CustomTextInput
              idText="month"
              label="月"
              description=""
              required={true}
              form={form}
              formValue="month"
              minLength={1}
              maxLength={2}
            />
            <Select
              label="利用者名"
              searchable
              nothingFound="No Data"
              data={userNameList}
              variant="filled"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="受給者証番号"
              value={man?.identification}
              variant="filled"
              disabled
              sx={{ '& input:disabled': { color: 'black' } }}
            />
          </SimpleGrid>
          <Space h="lg" />
          <SimpleGrid cols={4}>
            <Paper>
              <Text size="sm">同行（初任者等）</Text>
              <SimpleGrid cols={3}>
                <TextInput
                  variant="filled"
                  disabled
                  value={dokoAmount}
                  sx={{
                    '& input:disabled': {
                      ...(Number(dokoAmount) > man?.doko_amount
                        ? {
                            color: 'red',
                            fontWeight: 'bold',
                          }
                        : {
                            color: 'black',
                            fontWeight: 'normal',
                          }),
                    },
                  }}
                />
                <TextInput
                  value={man?.doko_amount}
                  variant="filled"
                  disabled
                  sx={{ '& input:disabled': { color: 'black' } }}
                />
                <Text size="sm">時間/月</Text>
              </SimpleGrid>
            </Paper>
          </SimpleGrid>
          <Space h="lg" />
          <Divider variant="dotted" />
          <Space h="lg" />
          <Paper>
            <Grid>
              <Grid.Col span={1}>
                <Text size="sm">日付</Text>
              </Grid.Col>
              <Grid.Col span={1}>
                <Text size="sm">曜日</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text size="sm">サービスの種類</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text size="sm">開始-終了時間</Text>
              </Grid.Col>
              <Grid.Col span={2}>
                <Text size="sm">算定時間数</Text>
              </Grid.Col>
            </Grid>
            <Space h="sm" />
            {form.values.content_arr.map((_, index) => (
              <Grid key={index}>
                <Grid.Col span={1}>
                  <TextInput
                    variant="filled"
                    maxLength={2}
                    onChange={(e) => handleChangeDate(e, index)}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    sx={{ '& input:disabled': { color: 'black' } }}
                    value={convertWeekItem(
                      new Date(
                        form.values.year,
                        form.values.month,
                        form.values.content_arr[index].work_date || 1
                      )
                    )}
                    variant="filled"
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    value={
                      form.values.content_arr[index].service_content
                    }
                    variant="filled"
                    disabled
                    sx={{ '& input:disabled': { color: 'black' } }}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TimeRangeInput
                    icon={<IconClock size={16} />}
                    variant="filled"
                    onChange={(e) =>
                      handleChangeTime(e[0], e[1], index)
                    }
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    sx={{ '& input:disabled': { color: 'black' } }}
                    value={
                      form.values.content_arr[index].start_time ||
                      form.values.content_arr[index].end_time
                        ? calcWorkTime(
                            new Date(
                              form.values.content_arr[
                                index
                              ].start_time!
                            ),
                            new Date(
                              form.values.content_arr[index].end_time!
                            )
                          )
                        : undefined
                    }
                    variant="filled"
                    disabled
                  />
                </Grid.Col>
              </Grid>
            ))}
          </Paper>
          <Space h="xl" />
          <CustomButton type="submit" fullWidth loading={isLoading}>
            新規登録
          </CustomButton>
        </Paper>
      </form>
    </Stack>
  );
};
