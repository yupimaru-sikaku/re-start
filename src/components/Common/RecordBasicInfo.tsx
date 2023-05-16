import { Select, SimpleGrid, TextInput } from '@mantine/core';
import React, { useMemo } from 'react';
import { CustomTextInput } from './CustomTextInput';
import { UseFormReturnType } from '@mantine/form';
import { NextPage } from 'next';
import { RootState } from '@/ducks/root-reducer';
import { useSelector } from '@/ducks/store';
import { excludingSelected } from '@/utils';

type Props = {
  type: 'create' | 'edit';
  form: UseFormReturnType<any>;
  amountTime: number;
};

export const RecordBasicInfo: NextPage<Props> = ({
  type,
  form,
  amountTime,
}) => {
  const isEdit = type === 'edit';
  const accompanyList = useSelector(
    (state: RootState) => state.accompany.accompanyList
  );
  const userList = useSelector((state: RootState) => state.user.userList);
  const selectedUser = userList.find((user) => user.name === form.values.name);
  const userListExcludingSelected = useMemo(() => {
    return excludingSelected(userList, accompanyList, form);
  }, [userList, accompanyList, form.values.year, form.values.month]);

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
        {...form.getInputProps('name')}
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
        value={`${selectedUser?.kodo_amount || 0} 時間/月`}
        variant="filled"
        disabled
        sx={{ '& input:disabled': { color: 'black' } }}
      />
      <TextInput
        label="合計算定時間数"
        value={`${amountTime} 時間`}
        variant="filled"
        disabled
        sx={{ '& input:disabled': { color: 'black' } }}
      />
    </SimpleGrid>
  );
};
