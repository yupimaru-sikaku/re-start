import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Anchor, Breadcrumbs, Container, ContainerProps, Space, Title } from '@mantine/core';
import { getPath } from '@/utils/const/getPath';

type PageContainerProps = {
  children: ReactNode;
  title: string;
} & Pick<ContainerProps, 'fluid'>;

export const PageContainer: FC<PageContainerProps> = ({ children, title, fluid }) => {
  return (
    <Container px={0} fluid={fluid}>
      <Title order={1} color="gray" pb="md">
        <Link href={getPath('INDEX')}>
          <a style={{ color: 'gray' }}>{title}</a>
        </Link>
      </Title>
      {children}
    </Container>
  );
};
