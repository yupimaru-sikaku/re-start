import Link from 'next/link';
import { Breadcrumbs } from '@mantine/core';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export const CustomBreadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <>
      <Breadcrumbs separator="→">
        {items.map((item, index) => (
          <Link key={index} href={item.href || ''} passHref>
            {item.label}
          </Link>
        ))}
      </Breadcrumbs>
    </>
  );
};
