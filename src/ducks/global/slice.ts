import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  themeMode: 'light' as 'light' | 'dark',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    changeThemeMode: (state, action: PayloadAction<typeof initialState.themeMode>) => {
      state.themeMode = action.payload;
    },
  },
});

export default globalSlice;

export const { changeThemeMode } = globalSlice.actions;
