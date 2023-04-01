import { DefaultMantineColor, MantineGradient, Text } from '@mantine/core';
import { NextPage } from 'next';
import { ReactNode, useEffect, useState } from 'react';
import { useMediaQuery } from 'src/libs/mantine/useMediaQuery';

type Props = {
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
  color?: DefaultMantineColor | 'dimmed';
  gradient?: MantineGradient;
  lineClamp?: number;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  span?: boolean;
  variant?: 'link' | 'text' | 'gradient';
  weight?: number;
  content?: 'large' | 'middle' | 'small';
  lineHeight?: number;
  letterSpacing?: number;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginRight?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingRight?: string;
  paddingLeft?: string;
};

export const CustomeText: NextPage<Props> = ({
  align,
  children,
  color,
  gradient,
  // ex）gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
  lineClamp,
  size,
  span,
  variant = 'text',
  weight = 400,
  content = 'middle',
  lineHeight = 'normal',
  letterSpacing,
  margin,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  padding,
  paddingTop,
  paddingBottom,
  paddingRight,
  paddingLeft,
}) => {
  const [fontSize, setFontSize] = useState<number>();
  const lagerThanXs = useMediaQuery('xs');
  const lagerThanMd = useMediaQuery('md');

  useEffect(() => {
    if (size && typeof size === 'number') {
      setFontSize(lagerThanMd ? size : lagerThanXs ? size / 2 : size / 3);
    } else {
      switch (content) {
        case 'large':
          setFontSize(lagerThanMd ? 32 : lagerThanXs ? 28 : 20);
          break;
        case 'middle':
          setFontSize(lagerThanMd ? 20 : lagerThanXs ? 18 : 16);
          break;
        case 'small':
          setFontSize(lagerThanMd ? 16 : lagerThanXs ? 14 : 12);
          break;
        default:
          setFontSize(18);
      }
    }
  }, [lagerThanMd, lagerThanXs]);

  return (
    <Text
      align={align}
      color={color}
      span={span}
      gradient={gradient}
      lineClamp={lineClamp}
      size={fontSize}
      variant={variant}
      weight={weight}
      sx={{
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
        margin: margin,
        marginTop: marginTop,
        marginBottom: marginBottom,
        marginRight: marginRight,
        marginLeft: marginLeft,
        padding: padding,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        paddingRight: paddingRight,
        paddingLeft: paddingLeft,
      }}
    >
      {children}
    </Text>
  );
};
