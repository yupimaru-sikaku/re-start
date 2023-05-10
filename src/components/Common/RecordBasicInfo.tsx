import {
  Divider,
  Select,
  SimpleGrid,
  Space,
  TextInput,
} from '@mantine/core';
import React from 'react';
import { CustomTextInput } from './CustomTextInput';
import { ReturnUser } from '@/ducks/user/slice';
import { UseFormReturnType } from '@mantine/form';
import { NextPage } from 'next';

type Props = {
  form: UseFormReturnType<any>;
  userList: ReturnUser[];
  selectedUser: ReturnUser | undefined;
  amountTime: number;
};

export const RecordBasicInfo: NextPage<Props> = ({
  form,
  userList,
  selectedUser,
  amountTime,
}) => {
  return (
    <SimpleGrid
      breakpoints={[
        { minWidth: 'sm', cols: 2 },
        { minWidth: 'md', cols: 5 },
        { minWidth: 'xl', cols: 7 },
      ]}
    >
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
        data={userList.map((user) => user.name)}
        variant="filled"
        {...form.getInputProps('name')}
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
        value={`${amountTime} 時間`}
        variant="filled"
        disabled
        sx={{
          '& input:disabled': {
            color: 'black',
          },
        }}
      />
    </SimpleGrid>
  );
};
