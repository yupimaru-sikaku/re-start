import { Select, SimpleGrid, TextInput } from '@mantine/core';
import React, { useMemo } from 'react';
import { CustomTextInput } from './CustomTextInput';
import { UseFormReturnType } from '@mantine/form';
import { NextPage } from 'next';
import { excludingSelected } from '@/utils';
import { ReturnUser } from '@/ducks/user/slice';

type Props = {
  type: 'create' | 'edit';
  form: UseFormReturnType<any>;
  recordList: any;
  userList: ReturnUser[];
  amountTime: number;
  contractedAmountTime: number;
};

export const RecordBasicInfo: NextPage<Props> = ({ type, form, recordList, userList, amountTime, contractedAmountTime }) => {
  const isEdit = type === 'edit';
  const isOver = amountTime > contractedAmountTime;
  const selectedUser = userList.find((user) => user.name === form.values.user_name);
  const userListExcludingSelected = useMemo(() => {
    return excludingSelected(userList, recordList, form);
  }, [userList, recordList, form.values.year, form.values.month]);
  return (
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
      <TextInput
        label="契約支給量"
        value={`${amountTime}時間 / ${contractedAmountTime}時間中`}
        variant="filled"
        disabled
        sx={{ '& input:disabled': { color: isOver ? 'red' : 'black' } }}
      />
    </SimpleGrid>
  );
};
