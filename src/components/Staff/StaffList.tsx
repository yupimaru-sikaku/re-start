import React from 'react';
import { useGetStaffListQuery } from '@/ducks/staff/query';
import { useSelector } from '@/ducks/store';
import { StaffTableList } from '@/components/Staff/StaffTableList';

export const StaffList = () => {
  const staffList = useSelector((state) => state.staff.staffList);
  const { isLoading: staffLoading } = useGetStaffListQuery(undefined, { refetchOnMountOrArgChange: true });

  return <StaffTableList loading={staffLoading} dataList={staffList} />;
};
