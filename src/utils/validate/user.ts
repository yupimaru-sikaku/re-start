export const validate = {
  name: (value: string) => {
    const { error, text } = validateName(value);
    return error ? text : null;
  },
  identification: (value: string) => {
    const { error, text } = validateIdentification(value);
    return error ? text : null;
  },
  city: (value: string) => {
    const { error, text } = validateCity(value);
    return error ? text : null;
  },
  disability_type: (value: string) => {
    const { error, text } = validateDisabilityType(value);
    return error ? text : null;
  },
};

const validateName = (value: string) => {
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

const validateIdentification = (value: string) => {
  if (value === '') {
    return {
      error: true,
      text: '受給者証番号を入力してください',
    };
  } else if (!/^([+-])?([0-9]+)(\.)?([0-9]+)?$/.test(value)) {
    return {
      error: true,
      text: '受給者証番号は数字で入力してください',
    };
  } else if (value.length !== 10) {
    return {
      error: true,
      text: '受給者証番号を10桁で入力してください',
    };
  }
  return {
    error: false,
    text: '',
  };
};

const validateCity = (value: string) => {
  if (value === '') {
    return {
      error: true,
      text: '市区町村を指定してください',
    };
  }
  return {
    error: false,
    text: '',
  };
};

const validateDisabilityType = (value: string) => {
  if (value === '') {
    return {
      error: true,
      text: 'サービス種別を指定してください',
    };
  }
  return {
    error: false,
    text: '',
  };
};
