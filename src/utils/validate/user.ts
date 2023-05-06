type ReturnType = {
  error: boolean;
  text: string;
};

export const validateName = (value: string): ReturnType => {
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

export const validateIdentification = (value: string): ReturnType => {
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

export const validateGenderSpecification = (
  value: string
): ReturnType => {
  if (value === '') {
    return {
      error: true,
      text: '性別を指定してください',
    };
  }
  return {
    error: false,
    text: '',
  };
};

export const validateCity = (value: string): ReturnType => {
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

export const validateDisabilityType = (value: string): ReturnType => {
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
