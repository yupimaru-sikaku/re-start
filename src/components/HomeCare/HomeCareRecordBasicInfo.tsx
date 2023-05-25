import { Select, SimpleGrid, TextInput } from '@mantine/core';
import React, { useMemo } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { NextPage } from 'next';
import { RootState } from '@/ducks/root-reducer';
import { useSelector } from '@/ducks/store';
import { KAZI, SHINTAI, TSUIN, WITH_TSUIN, excludingSelected } from '@/utils';
import { CustomTextInput } from '../Common/CustomTextInput';

type Props = {
  type: 'create' | 'edit';
  form: UseFormReturnType<any>;
  recordList: any;
  amountTime: any;
};

export const HomeCareRecordBasicInfo: NextPage<Props> = ({ type, form, recordList, amountTime }) => {
  const isEdit = type === 'edit';
  const userList = useSelector((state: RootState) => state.user.userList);
  const selectedUser = userList.find((user) => user.name === form.values.user_name);
  const userListExcludingSelected = useMemo(() => {
    return excludingSelected(userList, recordList, form);
  }, [userList, recordList, form.values.year, form.values.month]);
  const isOver = (currentTime: number, settingTime: number): boolean => {
    return currentTime > settingTime;
  };

  return (
    <>
      <SimpleGrid
        breakpoints={[
          { minWidth: 'sm', cols: 2 },
          { minWidth: 'md', cols: 5 },
          { minWidth: 'xl', cols: 7 },
        ]}
      >
        <CustomTextInput
          disabled={isEdit}
          idText="year"
          label="西暦"
          description=""
          required={true}
          form={form}
          formValue="year"
          minLength={4}
          maxLength={4}
          pattern="\d*"
        />
        <CustomTextInput
          disabled={isEdit}
          idText="month"
          label="月"
          description=""
          required={true}
          form={form}
          formValue="month"
          minLength={1}
          maxLength={2}
          pattern="\d*"
        />
        <Select
          disabled={isEdit}
          label="利用者名"
          searchable
          nothingFound="No Data"
          data={userListExcludingSelected.map((user) => ({
            value: user.value,
            label: user.value,
            disabled: user.disabled,
          }))}
          variant="filled"
          {...form.getInputProps('user_name')}
          sx={{ '& input:disabled': { color: 'black' } }}
        />
        <TextInput
          label="受給者証番号"
          value={selectedUser?.identification || ''}
          variant="filled"
          disabled
          sx={{ '& input:disabled': { color: 'black' } }}
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
      <SimpleGrid
        breakpoints={[
          { minWidth: 'sm', cols: 2 },
          { minWidth: 'md', cols: 5 },
          { minWidth: 'xl', cols: 7 },
        ]}
      >
        <TextInput
          label={KAZI}
          value={`${amountTime.kaziAmountTime}時間 / ${selectedUser?.kazi_amount || 0}時間中`}
          variant="filled"
          disabled
          sx={{
            '& input:disabled': { color: isOver(amountTime.kaziAmountTime, selectedUser?.kazi_amount || 0) ? 'red' : 'black' },
          }}
        />
        <TextInput
          label={SHINTAI}
          value={`${amountTime.shintaiAmountTime}時間 / ${selectedUser?.shintai_amount || 0}時間中`}
          variant="filled"
          disabled
          sx={{
            '& input:disabled': {
              color: isOver(amountTime.shintaiAmountTime, selectedUser?.shintai_amount || 0) ? 'red' : 'black',
            },
          }}
        />
        <TextInput
          label={TSUIN}
          value={`${amountTime.tsuinAmountTime}時間 / ${selectedUser?.tsuin_amount || 0}時間中`}
          variant="filled"
          disabled
          sx={{
            '& input:disabled': {
              color: isOver(amountTime.tsuinAmountTime, selectedUser?.tsuin_amount || 0) ? 'red' : 'black',
            },
          }}
        />
        <TextInput
          label={WITH_TSUIN}
          value={`${amountTime.withTsuinAmountTime}時間 / ${selectedUser?.with_tsuin_amount || 0}時間中`}
          variant="filled"
          disabled
          sx={{
            '& input:disabled': {
              color: isOver(amountTime.withTsuinAmountTime, selectedUser?.with_tsuin_amount || 0) ? 'red' : 'black',
            },
          }}
        />
      </SimpleGrid>
    </>
  );
};
