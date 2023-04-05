import { getPath } from '@/utils/const/getPath';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { CustomButton } from '../Common/CustomButton';
import { DashboardLayout } from '../Layout/DashboardLayout/DashboardLayout';

export const HomeCareSupport = () => {
  const router = useRouter();

  const moveToCreate = useCallback(() => {
    router.push(getPath('HOME_CARE_SUPPORT_CREATE'));
  }, []);

  return (
    <DashboardLayout title="居宅介護">
      <CustomButton onClick={moveToCreate}>実績記録票を作成する</CustomButton>
    </DashboardLayout>
  );
};
