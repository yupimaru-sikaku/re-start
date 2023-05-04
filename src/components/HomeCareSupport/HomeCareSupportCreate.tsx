import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { initialState } from '@/ducks/home-care-support/slice';
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
import { CustomTextInput } from '../Common/CustomTextInput';
import { CustomButton } from '../Common/CustomButton';
import { TimeRangeInput } from '@mantine/dates';
import { IconCheckbox, IconClock } from '@tabler/icons';
import { calcEachWorkTime, calcWorkTime, convertWeekItem } from '@/utils';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { User } from '@/ducks/user/slice';
import { NextPage } from 'next';
import { CustomConfirm } from '../Common/CustomConfirm';
import {
  validateMonth,
  validateName,
  validateYear,
} from '@/utils/validate/home-care-support';
import { CustomStepper } from '../Common/CustomStepper';
import { showNotification } from '@mantine/notifications';
import { getPath } from '@/utils/const/getPath';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { useGetUserListByCorporateIdQuery } from '@/ducks/user/query';

export const HomeCareSupportCreate: NextPage = () => {
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: userList } = useGetUserListByCorporateIdQuery(
    loginProviderInfo.corporate_id
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
  const { kaziAmount, shintaiAmount, withTsuinAmount, tsuinAmount } =
    calcEachWorkTime(form.values.content_arr);
  const man = (userList || []).filter((user) => user.name === form.values.name)[0];
  const serviceArr = (userList || [])
    .filter((user) => user.name === form.values.name)
    .map((x) => {
      let arr: string[] = [];
      x.is_kazi && arr.unshift('家事援助');
      x.is_shintai && arr.unshift('身体介護');
      x.is_with_tsuin && arr.unshift('通院等介助（伴う）');
      x.is_tsuin && arr.unshift('通院等介助（伴わない）');
      return arr;
    })[0];
  const serviceAmountArr = (userList || [])
    .filter((user) => user.name === form.values.name)
    .map((x) => {
      let arr: number[] = [];
      x.is_kazi && arr.unshift(man.kazi_amount);
      x.is_shintai && arr.unshift(man.shintai_amount);
      x.is_with_tsuin && arr.unshift(man.with_tsuin_amount);
      x.is_tsuin && arr.unshift(man.tsuin_amount);
      return arr;
    })[0];
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
      await CustomConfirm('記録は、少なくとも一行は作成ください。', 'Caution');
      return;
    }
    try {
      const { error } = await supabase.from(getDb('HOME_CARE')).insert({
        year: form.values.year,
        month: form.values.month,
        name: form.values.name,
        identification: man.identification,
        amount_title_1: serviceArr[0] ? serviceArr[0] : null,
        amount_value_1: serviceAmountArr[0] ? serviceAmountArr[0] : null,
        amount_title_2: serviceArr[1] ? serviceArr[1] : null,
        amount_value_2: serviceAmountArr[1] ? serviceAmountArr[1] : null,
        amount_title_3: serviceArr[2] ? serviceArr[2] : null,
        amount_value_3: serviceAmountArr[2] ? serviceAmountArr[2] : null,
        content_arr: formatArr,
        status: 0,
        user_id: loginProviderInfo.id,
      });
      showNotification({
        icon: <IconCheckbox />,
        message: '登録に成功しました！',
      });
      router.push(getPath('HOME_CARE_SUPPORT'));

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
          ? { ...content, work_date: Number(e.target.value) }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };

  const handleChangeService = (service: string | null, index: number) => {
    if (!service) return;
    const newContentArr = form.values.content_arr.map(
      (content, contentIndex) => {
        return contentIndex === index
          ? { ...content, service_content: service }
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
          ? { ...content, start_time: formatStartTime, end_time: formatEndTime }
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
            {man?.is_kazi && (
              <Paper>
                <Text size="sm">家事援助</Text>
                <SimpleGrid cols={3}>
                  <TextInput
                    value={kaziAmount}
                    variant="filled"
                    disabled
                    sx={{
                      '& input:disabled': {
                        ...(Number(kaziAmount) > man?.kazi_amount
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
                    value={man?.kazi_amount}
                    variant="filled"
                    disabled
                    sx={{ '& input:disabled': { color: 'black' } }}
                  />
                  <Text size="sm">時間/月</Text>
                </SimpleGrid>
              </Paper>
            )}
            {man?.is_shintai && (
              <Paper>
                <Text size="sm">身体介護</Text>
                <SimpleGrid cols={3}>
                  <TextInput
                    value={shintaiAmount}
                    variant="filled"
                    disabled
                    sx={{
                      '& input:disabled': {
                        ...(Number(shintaiAmount) > man?.shintai_amount
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
                    value={man?.shintai_amount}
                    variant="filled"
                    disabled
                    sx={{ '& input:disabled': { color: 'black' } }}
                  />
                  <Text size="sm">時間/月</Text>
                </SimpleGrid>
              </Paper>
            )}
            {man?.is_with_tsuin && (
              <Paper>
                <Text size="sm">通院等介助（伴う）</Text>
                <SimpleGrid cols={3}>
                  <TextInput
                    value={withTsuinAmount}
                    variant="filled"
                    disabled
                    sx={{
                      '& input:disabled': {
                        ...(Number(withTsuinAmount) > man?.with_tsuin_amount
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
                    value={man?.with_tsuin_amount}
                    variant="filled"
                    disabled
                    sx={{ '& input:disabled': { color: 'black' } }}
                  />
                  <Text size="sm">時間/月</Text>
                </SimpleGrid>
              </Paper>
            )}
            {man?.is_tsuin && (
              <Paper>
                <Text size="sm">通院等介助（伴わない）</Text>
                <SimpleGrid cols={3}>
                  <TextInput
                    value={tsuinAmount}
                    variant="filled"
                    disabled
                    sx={{
                      '& input:disabled': {
                        ...(Number(tsuinAmount) > man?.tsuin_amount
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
                    value={man?.tsuin_amount}
                    variant="filled"
                    disabled
                    sx={{ '& input:disabled': { color: 'black' } }}
                  />
                  <Text size="sm">時間/月</Text>
                </SimpleGrid>
              </Paper>
            )}
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
                  <Select
                    variant="filled"
                    label=""
                    searchable
                    nothingFound="No Data"
                    data={serviceArr || []}
                    onChange={(e) => handleChangeService(e, index)}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TimeRangeInput
                    icon={<IconClock size={16} />}
                    variant="filled"
                    onChange={(e) => handleChangeTime(e[0], e[1], index)}
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
                              form.values.content_arr[index].start_time!
                            ),
                            new Date(form.values.content_arr[index].end_time!)
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
