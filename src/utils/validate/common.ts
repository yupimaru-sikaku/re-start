type ReturnType = {
  error: boolean;
  text: string;
};

export const validateYear = (value: number): ReturnType => {
  if (!value) {
    return {
      error: true,
      text: '請求年（西暦）を入力して下さい',
    };
  } else if (value.toString().length !== 4) {
    return {
      error: true,
      text: '請求年は西暦で入力して下さい',
    };
  }
  return {
    error: false,
    text: '',
  };
};
export const validateMonth = (value: number): ReturnType => {
  if (!value) {
    return {
      error: true,
      text: '請求月を入力して下さい',
    };
  } else if (value > 12) {
    return {
      error: true,
      text: '請求月は1~12で入力して下さい',
    };
  }
  return {
    error: false,
    text: '',
  };
};
export const validateUserName = (value: string): ReturnType => {
  if (value === '') {
    return {
      error: true,
      text: '利用者名を入力して下さい',
    };
  }
  return {
    error: false,
    text: '',
  };
};
export const validateEmail = (value: string): ReturnType => {
  if (!/^\S+@\S+$/.test(value)) {
    return {
      error: true,
      text: 'メールアドレスの形式が正しくありません',
    };
  }
  return {
    error: false,
    text: '',
  };
};
