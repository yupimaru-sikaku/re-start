type ReturnType = {
  error: boolean;
  text: string;
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
