import { Button, MantineColor, MantineGradient } from '@mantine/core';
import { NextPage } from 'next';
import { ReactNode } from 'react';
import { useMediaQuery } from 'src/libs/mantine/useMediaQuery';

type Props = {
  children: ReactNode;
  color?: MantineColor;
  disabled?: boolean;
  gradient?: MantineGradient;
  leftIcon?: ReactNode;
  loaderPosition?: 'left' | 'right';
  loading?: boolean;
  radius?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?:
    | 'outline'
    | 'white'
    | 'light'
    | 'default'
    | 'filled'
    | 'subtle'
    | 'gradient';
  onClick?: () => void;
  fullWidth?: boolean;
  type?: 'button' | 'reset' | 'submit';
};

export const CustomButton: NextPage<Props> = ({
  children,
  color = 'blue',
  disabled = false,
  gradient,
  leftIcon,
  loaderPosition = 'left',
  loading = false,
  radius = 'sm',
  size,
  variant = 'filled',
  onClick,
  fullWidth = false,
  type = 'button',
}) => {
  const lagerThanMd = useMediaQuery('md');

  const buttonSize = lagerThanMd ? 'sm' : 'xs';

  return (
    <Button
      color={color}
      variant={variant}
      disabled={disabled}
      gradient={gradient}
      leftIcon={leftIcon}
      loaderPosition={loaderPosition}
      loading={loading}
      radius={radius}
      size={size ? size : buttonSize}
      onClick={onClick}
      fullWidth={fullWidth}
      type={type}
    >
      {children}
    </Button>
  );
};
