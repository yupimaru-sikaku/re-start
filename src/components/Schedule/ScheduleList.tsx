import { useGetScheduleListQuery } from '@/ducks/schedule/query';
import { useSelector } from '@/ducks/store';
import React from 'react';
import ScheduleTableList from 'src/components/Schedule/ScheduleTableList';

const ScheduleList = () => {
  const scheduleList = useSelector((state) => state.schedule.scheduleList);
  const { isLoading: scheduleLoading } = useGetScheduleListQuery(undefined, { refetchOnMountOrArgChange: true });

  return <ScheduleTableList loading={scheduleLoading} dataList={scheduleList} />;
};

export default ScheduleList;
