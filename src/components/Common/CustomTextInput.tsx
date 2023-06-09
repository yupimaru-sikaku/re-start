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
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  onChange?: any;
  pattern?: any;
};
export const CustomTextInput = ({
  idText,
  label,
  description,
  required,
  form,
  formValue,
  disabled = false,
  minLength,
  maxLength,
  defaultValue,
  onChange,
  pattern,
}: Props) => {
  return (
    <TextInput
      sx={{ '& input:disabled': { color: 'black' } }}
      id={idText}
      label={label}
      description={description}
      radius="sm"
      required={required}
      variant="filled"
      classNames={{
        input: 'rounded border-gray-300',
      }}
      disabled={disabled}
      minLength={minLength}
      maxLength={maxLength}
      defaultValue={defaultValue}
      onChange={onChange}
      pattern={pattern}
      {...form.getInputProps(formValue)}
    />
  );
};
