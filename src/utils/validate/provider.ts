import { CreateProviderWithSignUpParams } from '@/ducks/provider/slice';
import { validateEmail } from './common';

type ReturnType = {
  error: boolean;
  text: string;
};

export const validate = (type: 'create' | 'edit') => ({
  corporate_name: (value: string) => {
    const { error, text } = validateCorporateName(value);
    return error ? text : null;
  },
  office_name: (value: string) => {
    const { error, text } = validateOfficeName(value);
    return error ? text : null;
  },
  email: (value: string) => {
    const { error, text } = validateEmail(value);
    return error ? text : null;
  },
  password: (value: string) => {
    const { error, text } = validatePassword(value, type);
    return error ? text : null;
  },
  password_confirmation: (value: string, values: CreateProviderWithSignUpParams) =>
    value !== values.password && 'パスワードが一致しません',
});

export const validateCorporateName = (value: string): ReturnType => {
  if (value === '') {
    return {
      error: true,
      text: '法人名を入力してください',
    };
  }
  return {
    error: false,
    text: '',
  };
};

export const validateOfficeName = (value: string): ReturnType => {
  if (value === '') {
    return {
      error: true,
      text: '事業所名を入力してください',
    };
  }
  return {
    error: false,
    text: '',
  };
};

export const validatePassword = (value: string, type: 'create' | 'edit' = 'create'): ReturnType => {
  if (type === 'edit') {
    return {
      error: false,
      text: '',
    };
  } else if (value === '') {
    return {
      error: true,
      text: 'パスワードを入力してください',
    };
  } else if (value.length <= 7) {
    return {
      error: true,
      text: 'パスワードは8文字以上で入力してください',
    };
  }
  return {
    error: false,
    text: '',
  };
};
