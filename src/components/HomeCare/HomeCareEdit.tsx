import { useFocusTrap } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useMemo, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import {
  CreateHomeCare,
  initialState,
  ReturnHomeCare,
} from '@/ducks/home-care/slice';
import {
  ActionIcon,
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
import { IconCheckbox, IconClock, IconRefresh } from '@tabler/icons';
import {
  calcEachWorkTime,
  calcWorkTime,
  convertWeekItem,
} from '@/utils';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { User } from '@/ducks/user/slice';
import { NextPage } from 'next';
import { CustomConfirm } from '../Common/CustomConfirm';
import {
  validateMonth,
  validateName,
  validateYear,
} from '@/utils/validate/home-care';
import { CustomStepper } from '../Common/CustomStepper';
import { showNotification } from '@mantine/notifications';
import { getPath } from '@/utils/const/getPath';
import { ReturnStaff } from '@/ducks/staff/slice';
import { format } from 'path';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { ContentArr } from '@/ducks/accompany/slice';

type Props = {
  userData: ReturnHomeCare;
  userList: User[];
  staffList: ReturnStaff[];
};

export const HomeCareEdit: NextPage<Props> = ({
  userData,
  userList,
  staffList,
}) => {
  const focusTrapRef = useFocusTrap();
  const router = useRouter();
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const staffArr = staffList.map((staff) => staff.name);
  // const userNameList = (userData || []).map((user) => user.name);
  // const currentDate = new Date();
  const form = useForm({
    initialValues: {
      year: userData.year,
      month: userData.month,
      name: userData.name,
      identification: userData.identification,
      amount_title_1: userData.amount_title_1,
      amount_value_1: userData.amount_value_1,
      amount_title_2: userData.amount_title_2,
      amount_value_2: userData.amount_value_2,
      amount_title_3: userData.amount_title_2,
      amount_value_3: userData.amount_value_3,
      content_arr: [
        ...userData.content_arr,
        ...Array.from(
          { length: 31 - userData.content_arr.length },
          () => initialState.content_arr[0]
        ),
      ],
      status: userData.status,
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
  const man = userList.filter(
    (user) => user.name === form.values.name
  )[0];

  // 編集時の初期値をmemo化（不要かも）
  // const oldArr = useMemo(() => {
  //   return userData.content_arr;
  // }, [userData.content_arr]);
  // console.log('oldArr', oldArr);

  const serviceArr = userList
    .filter((user) => user.name === form.values.name)
    .map((x) => {
      let arr: string[] = [];
      x.is_kazi && arr.unshift('家事援助');
      x.is_shintai && arr.unshift('身体介護');
      x.is_with_tsuin && arr.unshift('通院等介助（伴う）');
      x.is_tsuin && arr.unshift('通院等介助（伴わない）');
      return arr;
    })[0];
  const serviceAmountArr = userList
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
      '編集を完了しますか？',
      '確認画面'
    );
    if (!isOK) {
      setIsLoading(false);
      return;
    }

    try {
      const staff_schedule_content_arr = form.values.content_arr.map(
        (content) => {
          return { ...content, user_name: form.values.name };
        }
      );
      // content_arrを整形（nullを除外、work_dateでソート）
      const nonNullableAndSortArr = form.values.content_arr
        .filter((content) => {
          return (
            content.work_date &&
            content.service_content !== '' &&
            content.start_time &&
            content.end_time
          );
        })
        .sort((a, b) => a.work_date! - b.work_date!);

      if (nonNullableAndSortArr.length === 0) {
        await CustomConfirm(
          '記録は、少なくとも一行は作成ください。',
          'Caution'
        );
        setIsLoading(false);
        return;
      }
      // リスタートのみ実行
      if (loginProviderInfo.role === 'admin') {
        // 初期値の配列を元に該当をリセット
        // 最初に入力していたデータは一旦削除（不要かも）
        // const oldFormatArr = Object.values(
        //   oldArr.reduce<{
        //     [key: string]: CreateHomeCare['content_arr'];
        //   }>((result, currentValue) => {
        //     if (
        //       currentValue['staff_name'] !== null &&
        //       currentValue['staff_name'] !== undefined
        //     ) {
        //       (result[currentValue['staff_name']] =
        //         result[currentValue['staff_name']] || []).push(currentValue);
        //     }
        //     return result;
        //   }, {})
        // );
        // oldFormatArr.map(async (contentList) => {
        //   const staffName = contentList[0].staff_name;
        //   const { data: getOldData, error: getOldError } = await supabase
        //     .from(getDb('STAFF_SCHEDULE'))
        //     .select('*')
        //     .eq('year', form.values.year)
        //     .eq('month', form.values.month)
        //     .eq('staff_name', staffName);

        //   if (getOldError) {
        //     console.log('getOldError', getOldError);
        //     await CustomConfirm(
        //       'スタッフの過去の勤務状況の取得に失敗しました',
        //       'Caution'
        //     );
        //     setIsLoading(false);
        //     return;
        //   }

        //   const newArr = getOldData[0].content_arr.filter(
        //     (content: StaffScheduleContentArr) => {
        //       return !oldArr.some((oldContent) => {
        //         return (
        //           oldContent.service_content === content.service_content &&
        //           form.values.name === content.user_name
        //         );
        //       });
        //     }
        //   );
        // });

        // 名前毎に配列を作成した新しいcontent_arr配列を作成[][]
        const formatArr = Object.values(
          nonNullableAndSortArr.reduce<{
            [key: string]: CreateHomeCare['content_arr'];
          }>((result, currentValue) => {
            if (
              currentValue['staff_name'] !== null &&
              currentValue['staff_name'] !== undefined
            ) {
              (result[currentValue['staff_name']] =
                result[currentValue['staff_name']] || []).push(
                currentValue
              );
            }
            return result;
          }, {})
        );
        formatArr.map(async (contentList) => {
          const staffName = contentList[0].staff_name;
          const { data: getData, error: getError } = await supabase
            .from(getDb('SCHEDULE'))
            .select('*')
            .eq('year', form.values.year)
            .eq('month', form.values.month)
            .eq('staff_name', staffName);
          if (getError) {
            console.log('getError', getError);
            await CustomConfirm(
              'スタッフの勤務状況の取得に失敗しました',
              'Caution'
            );
            setIsLoading(false);
            return;
          }
          if (getData.length) {
            const removeArr = getData[0].content_arr.filter(
              (content: ContentArr) => {
                const isDuplicateUserName =
                  content.staff_name === form.values.name;
                const isDuplicateServiceContent =
                  content.service_content === '家事援助' ||
                  content.service_content === '身体介護' ||
                  content.service_content === '通院等介助（伴う）' ||
                  content.service_content ===
                    '通院等介助（伴わない）';
                return !(
                  isDuplicateUserName && isDuplicateServiceContent
                );
              }
            );
            console.log(removeArr, contentList);
            const newArr = [...removeArr, ...contentList]
              .sort((a, b) => a.work_date! - b.work_date!)
              .map((content) => {
                return { ...content, user_name: form.values.name };
              });
            const { error: updateError } = await supabase
              .from(getDb('SCHEDULE'))
              .update({
                content_arr: newArr,
              })
              .eq('id', getData[0].id);

            if (updateError) {
              console.log('updateError', updateError);
              await CustomConfirm(
                'スタッフの勤務状況の更新に失敗しました',
                'Caution'
              );
              setIsLoading(false);
              return;
            }
          } else {
            const newArr = contentList.map((content) => {
              return { ...content, user_name: form.values.name };
            });
            const { error: createError } = await supabase
              .from(getDb('SCHEDULE'))
              .insert({
                year: form.values.year,
                month: form.values.month,
                staff_name: staffName,
                content_arr: newArr,
              });
            if (createError) {
              console.log('createError', createError);
              await CustomConfirm(
                'スタッフの勤務状況の新規作成に失敗しました',
                'Caution'
              );
              setIsLoading(false);
              return;
            }
          }
        });
      }
      const { error: updateError } = await supabase
        .from('home_care_records')
        .update({
          year: form.values.year,
          month: form.values.month,
          content_arr: nonNullableAndSortArr,
        })
        .eq('id', userData.id);
      showNotification({
        icon: <IconCheckbox />,
        message: '更新に成功しました！',
      });
      router.push(getPath('HOME_CARE'));

      if (updateError) {
        console.log(updateError);
        alert('実績記録表の更新に失敗しました。');
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
    const newContentArr = (form.values.content_arr || []).map(
      (content, contentIndex) => {
        return contentIndex === index
          ? { ...content, work_date: Number(e.target.value) }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };

  const handleChangeService = (
    service: string | null,
    index: number
  ) => {
    if (!service) return;
    const newContentArr = (form.values.content_arr || []).map(
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

  const handleRefresh = (index: number) => {
    const newContentArr = (form.values.content_arr || []).map(
      (content, contentIndex) => {
        return contentIndex === index
          ? {
              work_date: 0,
              service_content: '',
              start_time: '',
              end_time: '',
              staff_name: '',
            }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };
  const handleChangeStaff = (
    staff_name: string | null,
    index: number
  ) => {
    if (!staff_name) return;
    const newContentArr = (form.values.content_arr || []).map(
      (content, contentIndex) => {
        return contentIndex === index
          ? { ...content, staff_name }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };

  return (
    <Stack>
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper />
      </Paper>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={focusTrapRef}>
        <Paper withBorder shadow="md" p={30} radius="md">
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
            <TextInput
              label="利用者名"
              value={userData.name}
              variant="filled"
              disabled
              sx={{ '& input:disabled': { color: 'black' } }}
            />
            <TextInput
              label="受給者証番号"
              value={userData.identification}
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
                        ...(Number(shintaiAmount) >
                        man?.shintai_amount
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
                        ...(Number(withTsuinAmount) >
                        man?.with_tsuin_amount
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
            </Grid>
            <Space h="sm" />
            {form.values.content_arr.map((content, index) => (
              <Grid key={index}>
                <Grid.Col span={1}>
                  <TextInput
                    value={
                      form.values.content_arr[index].work_date || ''
                    }
                    variant="filled"
                    maxLength={2}
                    onChange={(e) => handleChangeDate(e, index)}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    sx={{ '& input:disabled': { color: 'black' } }}
                    // value={convertWeekItem(
                    //   new Date(
                    //     form.values.year,
                    //     form.values.month,
                    //     form.values.content_arr[index].work_date || 1
                    //   )
                    // )}
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
                    value={
                      form.values.content_arr[index].service_content
                    }
                    onChange={(e) => handleChangeService(e, index)}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TimeRangeInput
                    icon={<IconClock size={16} />}
                    variant="filled"
                    value={
                      form.values.content_arr[index].start_time &&
                      form.values.content_arr[index].end_time
                        ? [
                            new Date(
                              form.values.content_arr[
                                index
                              ].start_time!
                            ),
                            new Date(
                              form.values.content_arr[index].end_time!
                            ),
                          ]
                        : [null, null]
                    }
                    onChange={(e) =>
                      handleChangeTime(e[0], e[1], index)
                    }
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    sx={{ '& input:disabled': { color: 'black' } }}
                    value={calcWorkTime(
                      content.start_time,
                      content.end_time
                    )}
                    variant="filled"
                    disabled
                  />
                </Grid.Col>
                {loginProviderInfo.role === 'admin' && (
                  <Grid.Col span={1}>
                    <Select
                      variant="filled"
                      label=""
                      searchable
                      nothingFound="No Data"
                      data={staffArr || []}
                      value={
                        form.values.content_arr[index].staff_name
                      }
                      onChange={(e) => handleChangeStaff(e, index)}
                    />
                  </Grid.Col>
                )}
                <Grid.Col span={1}></Grid.Col>
                <Grid.Col span={1}>
                  <ActionIcon onClick={() => handleRefresh(index)}>
                    <IconRefresh />
                  </ActionIcon>
                </Grid.Col>
              </Grid>
            ))}
          </Paper>
          <Space h="xl" />
          <CustomButton type="submit" fullWidth loading={isLoading}>
            編集
          </CustomButton>
        </Paper>
      </form>
    </Stack>
  );
};
