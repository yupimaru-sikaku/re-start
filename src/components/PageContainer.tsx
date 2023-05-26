import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Grid, Breadcrumbs, Container, ContainerProps, Space, Title } from '@mantine/core';
import { getPath } from '@/utils/const/getPath';
import { useSelector } from '@/ducks/store';

type PageContainerProps = {
  children: ReactNode;
  title: string;
} & Pick<ContainerProps, 'fluid'>;

export const PageContainer: FC<PageContainerProps> = ({ children, title, fluid }) => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  return (
    <Container px={0} fluid={fluid}>
      <Grid style={{ display: 'flex', placeItems: 'center', gap: 15 }}>
        <Title order={1} color="gray" pb="md">
          <Link href={getPath('INDEX')}>
            <a style={{ color: 'gray' }}>{title}</a>
          </Link>
        </Title>
        <Title size="sm" order={1} color="gray" pb="md">
          {loginProviderInfo.corporate_name}
        </Title>
        <Title size="sm" order={1} color="gray" pb="md">
          {loginProviderInfo.office_name}
        </Title>
      </Grid>
      {children}
    </Container>
  );
};
