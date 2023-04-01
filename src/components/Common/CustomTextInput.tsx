import { TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';

type Props = {
  idText: string;
  label: string;
  description: string;
  required: boolean;
  form: UseFormReturnType<any>;
  formValue: string;
};
export const CustomTextInput = ({
  idText,
  label,
  description,
  required,
  form,
  formValue,
}: Props) => {
  return (
    <TextInput
      id={idText}
      label={label}
      description={description}
      radius="sm"
      required={required}
      variant="filled"
      classNames={{
        input: 'rounded border-gray-300',
      }}
      {...form.getInputProps(formValue)}
    />
  );
};
