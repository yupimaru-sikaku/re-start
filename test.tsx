import React from 'react';
import { Text } from '@mantine/core';

const test = () => {
  return (
    <Text
      sx={(theme) => {
        return {
          fontSize: '5.6rem',
          [theme.fn.smallerThan(theme.breakpoints.lg)]: {
            fontSize: '4.8rem',
          },
          [theme.fn.smallerThan(theme.breakpoints.md)]: {
            fontSize: '3.6rem',
          },
          [theme.fn.smallerThan(theme.breakpoints.sm)]: {
            fontSize: '3rem',
          },
        };
      }}
    ></Text>
  );
};

export default test;
