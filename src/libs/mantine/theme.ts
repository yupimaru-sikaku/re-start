import React from 'react';

const primary = '#228be6';
const secondary = '#536e95';
const tertiary = '#11afd5';
const bgColor = '#f8f9fa';
const white = '#fff';
const black = '#495957';

export const lightTheme = {};

export const darkTheme = {};

export const getTheme = (theme: 'light' | 'dark') => {
  return theme === 'light' ? lightTheme : darkTheme;
};
