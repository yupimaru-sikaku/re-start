import { InputVariant, Textarea } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';

type Props = {
  idText: string;
  label: string;
  autosize: boolean;
  description?: string;
  required: boolean;
  minRows: number;
  form: UseFormReturnType<any>;
  formValue: string;
  variant?: InputVariant;
};
export const CustomTextArea = ({
  idText,
  label,
  autosize,
  description,
  required,
  minRows,
  form,
  formValue,
  variant,
}: Props) => {
  return (
    <Textarea
      id={idText}
      label={label}
      autosize={autosize}
      minRows={minRows}
      description={description}
      required={required}
      classNames={{
        input: 'rounded',
      }}
      {...form.getInputProps(formValue)}
    />
  );
};
