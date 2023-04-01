export type Provider = {
  id?: string;
  corporateName: string;
  officeName: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
};

export const initialState: Provider = {
  id: '',
  corporateName: '',
  officeName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};
