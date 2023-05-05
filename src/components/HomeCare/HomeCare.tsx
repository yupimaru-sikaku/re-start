import { getPath } from '@/utils/const/getPath';
import React from 'react';
import { CustomButton } from '../Common/CustomButton';
import { DashboardLayout } from '../Layout/DashboardLayout/DashboardLayout';
import Link from 'next/link';

export const HomeCare = () => {
  return (
    <DashboardLayout title="居宅介護">
      <Link href={getPath('HOME_CARE_CREATE')}>
        <a>
          <CustomButton>実績記録票を作成する</CustomButton>
        </a>
      </Link>
    </DashboardLayout>
  );
};
