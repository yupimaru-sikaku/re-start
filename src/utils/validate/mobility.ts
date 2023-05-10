import {
  validateMonth,
  validateUserName,
  validateYear,
} from './common';

export const validate = {
  year: (value: number) => {
    const { error, text } = validateYear(value);
    return error ? text : null;
  },
  month: (value: number) => {
    const { error, text } = validateMonth(value);
    return error ? text : null;
  },
  name: (value: string) => {
    const { error, text } = validateUserName(value);
    return error ? text : null;
  },
};
