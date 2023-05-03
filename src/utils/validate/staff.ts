type ReturnType = {
  error: boolean;
  text: string;
};

export const validateName = (value: string): ReturnType => {
  if (value === '') {
    return {
      error: true,
      text: 'スタッフ名を入力して下さい',
    };
  }
  return {
    error: false,
    text: '',
  };
};

export const validateFurigana = (value: string): ReturnType => {
  if (value === '') {
    return {
      error: true,
      text: 'ふりがなを入力して下さい',
    };
  }
  return {
    error: false,
    text: '',
  };
};

export const validateWorkTimePerWeek = (value: number): ReturnType => {
  if (value <= 0) {
    return {
      error: true,
      text: '適切な勤務時間を入力して下さい',
    };
  }
  return {
    error: false,
    text: '',
  };
};
