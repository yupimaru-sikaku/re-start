import {
  ActionIcon,
  Divider,
  Grid,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { CustomStepper } from '../Common/CustomStepper';
import { useForm } from '@mantine/form';
import {
  CreateMobilityParams,
  CreateMobilityResult,
  UpdateMobilityParams,
  UpdateMobilityResult,
  createInitialState,
} from '@/ducks/mobility/slice';
import {
  validateMonth,
  validateName,
  validateYear,
} from '@/utils/validate/mobility';
import { useFocusTrap } from '@mantine/hooks';
import { CustomTextInput } from '../Common/CustomTextInput';
import { useGetUserListByServiceQuery } from '@/ducks/user/query';
import {
  calcWorkTime,
  convertStartEndTimeFromString2Date,
  convertWeekItem,
} from '@/utils';
import { TimeRangeInput } from '@mantine/dates';
import { IconCheckbox, IconClock, IconRefresh } from '@tabler/icons';
import { CustomConfirm } from '../Common/CustomConfirm';
import { showNotification } from '@mantine/notifications';
import { getPath } from '@/utils/const/getPath';
import { useRouter } from 'next/router';
import {
  useCreateMobilityMutation,
  useGetMobilityDataQuery,
  useUpdateMobilityMutation,
} from '@/ducks/mobility/query';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { CustomButton } from '../Common/CustomButton';
import { NextPage } from 'next';
import { skipToken } from '@reduxjs/toolkit/dist/query';

type Props = {
  type: 'create' | 'edit';
};

export const MobilityCreate: NextPage<Props> = ({ type }) => {
  const router = useRouter();
  const focusTrapRef = useFocusTrap();
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const TITLE = type === 'create' ? '登録' : '更新';
  const mobilityId = router.query.id as string;
  const {
    data: mobilityData,
    isLoading: mobilityDataLoding,
    refetch,
  } = useGetMobilityDataQuery(mobilityId || skipToken);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();
  const { data: userList = [] } =
    useGetUserListByServiceQuery('is_ido');
  const [createMobility] = useCreateMobilityMutation();
  const [updateMobility] = useUpdateMobilityMutation();
  const form = useForm({
    initialValues: {
      ...createInitialState,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      content_arr: Array.from(
        { length: 40 },
        () => createInitialState.content_arr[0]
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

  // useFormは再レンダリングされないので
  useEffect(() => {
    if (!mobilityData) return;
    refetch();
    const newContentArr = [
      ...mobilityData.content_arr,
      ...Array.from(
        { length: 40 - mobilityData.content_arr.length },
        () => createInitialState.content_arr[0]
      ),
    ];
    form.setValues({
      ...mobilityData,
      content_arr: newContentArr,
    });
  }, [mobilityData]);

  const selectedUser = userList.find(
    (user) => user.name === form.values.name
  );
  const idoAmount = form.values.content_arr.reduce((sum, content) => {
    if (content.start_time === '' || content.end_time === '') {
      return sum;
    }
    return (
      sum +
      Number(
        calcWorkTime(
          new Date(content.start_time!),
          new Date(content.end_time!)
        )
      )
    );
  }, 0);

  const handleChangeDate = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newContentArr = form.values.content_arr.map(
      (content, contentIndex) =>
        contentIndex === index
          ? { ...content, work_date: Number(value) }
          : content
    );

    form.setFieldValue('content_arr', newContentArr);
  };

  const handleChangeTime = (
    start_time: Date,
    end_time: Date,
    index: number
  ) => {
    if (!start_time || !end_time) return;
    const newContentArr = form.values.content_arr.map(
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
      (content, contentIndex) =>
        contentIndex === index
          ? {
              work_date: 0,
              service_content: '',
              start_time: '',
              end_time: '',
              staff_name: '',
            }
          : content
    );

    form.setFieldValue('content_arr', newContentArr);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const isOK = await CustomConfirm(
      `実績記録票を${TITLE}しますか？後から修正は可能です。`,
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
          content.work_date && content.start_time && content.end_time
        );
      })
      .map((content) => {
        return {
          ...content,
          service_content: '行動援護',
        };
      })
      .sort((a, b) => a.work_date! - b.work_date!);
    if (formatArr.length === 0) {
      await CustomConfirm(
        '記録は、少なくとも一行は作成ください。',
        'Caution'
      );
      setIsLoading(false);
      return;
    }
    try {
      if (type === 'create') {
        const params: CreateMobilityParams = {
          ...form.values,
          content_arr: formatArr,
          identification: selectedUser!.identification,
          city: selectedUser!.city,
          corporate_id: loginProviderInfo.corporate_id,
          login_id: loginProviderInfo.id,
        };
        const { error } = (await createMobility(
          params
        )) as CreateMobilityResult;
        if (error) {
          throw new Error(`記録票の${TITLE}に失敗しました。${error}`);
        }
        showNotification({
          icon: <IconCheckbox />,
          message: `${TITLE}に成功しました！`,
        });
        router.push(getPath('MOBILITY'));
      } else {
        const params: UpdateMobilityParams = {
          ...form.values,
          id: mobilityData!.id,
          content_arr: formatArr,
          identification: selectedUser!.identification,
          city: selectedUser!.city,
          corporate_id: loginProviderInfo.corporate_id,
          login_id: loginProviderInfo.id,
        };
        const { error } = (await updateMobility(
          params
        )) as UpdateMobilityResult;
        if (error) {
          throw new Error(`記録票の${TITLE}に失敗しました。${error}`);
        }
        showNotification({
          icon: <IconCheckbox />,
          message: `${TITLE}に成功しました！`,
        });
        router.push(getPath('MOBILITY'));
      }
    } catch (error: any) {
      await CustomConfirm(error.message, 'Caution');
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <Stack>
      <Paper withBorder shadow="md" p={30} radius="md">
        <CustomStepper />
      </Paper>
      <LoadingOverlay visible={mobilityDataLoding} />
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        ref={focusTrapRef}
        className="relative"
      >
        <Paper withBorder shadow="md" p={30} radius="md">
          <SimpleGrid
            breakpoints={[
              { minWidth: 'sm', cols: 4 },
              { minWidth: 'md', cols: 5 },
              { minWidth: 'xl', cols: 6 },
            ]}
          >
            <CustomTextInput
              idText="year"
              label="西暦"
              description=""
              required={false}
              form={form}
              formValue="year"
              minLength={4}
              maxLength={4}
            />
            <CustomTextInput
              idText="month"
              label="月"
              description=""
              required={false}
              form={form}
              formValue="month"
              minLength={1}
              maxLength={2}
            />
            <Select
              label="利用者名"
              searchable
              nothingFound="No Data"
              data={userList.map((user) => user.name)}
              variant="filled"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="受給者証番号"
              value={selectedUser?.identification || ''}
              variant="filled"
              disabled
              sx={{
                '& input:disabled': {
                  color: 'black',
                },
              }}
            />
            <TextInput
              label="契約支給量"
              value={`${selectedUser?.kodo_amount || 0} 時間/月`}
              variant="filled"
              disabled
              sx={{
                '& input:disabled': {
                  color: 'black',
                },
              }}
            />
            <TextInput
              label="合計算定時間数"
              value={`${idoAmount} 時間`}
              variant="filled"
              disabled
              sx={{
                '& input:disabled': {
                  color: 'black',
                },
              }}
            />
            <TextInput
              label="市区町村"
              value={selectedUser?.city || ''}
              variant="filled"
              disabled
              sx={{
                '& input:disabled': {
                  color: 'black',
                },
              }}
            />
          </SimpleGrid>
          <Space h="lg" />
          <Divider variant="dotted" />
          <Space h="lg" />
          <Paper sx={{ overflowX: 'auto' }}>
            <Table sx={{ width: '550px' }}>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>日付</th>
                  <th style={{ width: '100px' }}>曜日</th>
                  <th style={{ width: '200px' }}>開始-終了時間</th>
                  <th style={{ width: '150px' }}>算定時間数</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.values.content_arr.map((content, index) => (
                  <tr key={index}>
                    <td>
                      <TextInput
                        variant="filled"
                        maxLength={2}
                        onChange={(e) => handleChangeDate(e, index)}
                        value={content.work_date || ''}
                      />
                    </td>
                    <td>
                      <TextInput
                        sx={{
                          '& input:disabled': {
                            color: 'black',
                          },
                        }}
                        value={convertWeekItem(
                          new Date(
                            form.values.year,
                            form.values.month,
                            form.values.content_arr[index].work_date
                          )
                        )}
                        variant="filled"
                        disabled
                      />
                    </td>
                    <td>
                      <TimeRangeInput
                        icon={<IconClock size={16} />}
                        variant="filled"
                        value={convertStartEndTimeFromString2Date(
                          content.start_time,
                          content.end_time
                        )}
                        onChange={(e) =>
                          handleChangeTime(e[0], e[1], index)
                        }
                      />
                    </td>
                    <td>
                      <TextInput
                        sx={{
                          '& input:disabled': {
                            color: 'black',
                          },
                        }}
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
                                  form.values.content_arr[
                                    index
                                  ].end_time!
                                )
                              )
                            : ''
                        }
                        variant="filled"
                        disabled
                      />
                    </td>
                    <td>
                      <ActionIcon
                        onClick={() => handleRefresh(index)}
                      >
                        <IconRefresh />
                      </ActionIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
          <Space h="xl" />
          <CustomButton type="submit" fullWidth loading={isLoading}>
            {TITLE}
          </CustomButton>
        </Paper>
      </form>
    </Stack>
  );
};
