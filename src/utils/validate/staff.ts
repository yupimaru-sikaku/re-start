export const validate = {
  name: (value: string) => {
    const { error, text } = validateName(value);
    return error ? text : null;
  },
  furigana: (value: string) => {
    const { error, text } = validateFurigana(value);
    return error ? text : null;
  },
  work_time_per_week: (value: number) => {
    const { error, text } = validateWorkTimePerWeek(value);
    return error ? text : null;
  },
};

const validateName = (value: string) => {
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

const validateFurigana = (value: string) => {
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

const validateWorkTimePerWeek = (value: number) => {
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
