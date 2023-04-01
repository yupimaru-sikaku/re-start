import { PasswordInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconLock } from '@tabler/icons';
import React from 'react';

type Props = {
  idText: string;
  label: string;
  description: string;
  required: boolean;
  form: UseFormReturnType<any>;
  formValue: string;
};
export const CustomPasswordInput = ({
  idText,
  label,
  description,
  required,
  form,
  formValue,
}: Props) => {
  return (
    <PasswordInput
      id={idText}
      label={label}
      description={description}
      radius="sm"
      required={required}
      variant="filled"
      icon={<IconLock size={16} />}
      classNames={{
        innerInput: 'rounded border-gray-300',
      }}
      {...form.getInputProps(formValue)}
    />
  );
};
