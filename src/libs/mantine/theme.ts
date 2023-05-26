const primary = '#7895B2';
const secondary = '#AEBDCA';
const tertiary = '#E8DFCA';
const bgColor = '#F5EFE6';
const white = '#fff';
const black = '#495957';
const extra1 = '#abcdef';
const extra2 = '#fedcba';
const extra3 = '#123456';
const extra4 = '#654321';

import { MantineTheme, DEFAULT_THEME, ColorScheme } from '@mantine/core';

const lightTheme: MantineTheme = {
  ...DEFAULT_THEME,
  colorScheme: 'light' as ColorScheme,
  colors: {
    ...DEFAULT_THEME.colors,
  },
};

const darkTheme: MantineTheme = {
  ...DEFAULT_THEME,
  colorScheme: 'dark' as ColorScheme,
  colors: {
    ...DEFAULT_THEME.colors,
    dark: ['#d5d7e0', '#acaebf', '#8c8fa3', '#666980', '#4d4f66', '#34354a', '#2b2c3d', '#1d1e30', '#0c0d21', '#01010a'],
    gray: ['#2b2c3d', '#acaebf', '#8c8fa3', '#666980', '#4d4f66', '#34354a', '#2b2c3d', '#d5d7e0', '#0c0d21', '#01010a'],
  },
};

export const getTheme = (theme: 'light' | 'dark') => {
  return theme === 'light' ? lightTheme : darkTheme;
};
