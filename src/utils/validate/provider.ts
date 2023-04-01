type ReturnType = {
  error: boolean;
  text: string;
};

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

export const validatePassword = (value: string): ReturnType => {
  if (value === '') {
    return {
      error: true,
      text: 'パスワードを入力してください',
    };
  } else if (value.length <= 8) {
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
