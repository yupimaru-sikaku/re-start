import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactElement } from 'react';

type Props = Omit<LinkProps, 'children'> & {
  children: (isActive: boolean) => ReactElement;
};

export const ActiveLink: FC<Props> = ({ children, ...linkProps }) => {
  const { asPath } = useRouter();

  const isActive = asPath === linkProps.href || asPath.startsWith(`${linkProps.href}/`);

  return <Link {...linkProps}>{children(isActive)}</Link>;
};
