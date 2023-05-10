import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffList } from '@/components/Staff/StaffList';
import { ReturnStaff } from '@/ducks/staff/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Box, Group, Space } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import {
  GetStaticPaths,
  GetStaticPropsContext,
  NextPage,
} from 'next';

import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import {
  Calendar,
  DateLocalizer,
  Formats,
  momentLocalizer,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ja';
import { CustomToolbar } from '@/components/StaffSchedule/CustomToolbar';
import {
  GetScheduleParams,
  ScheduleContentArr,
} from '@/ducks/schedule/slice';
import { title } from 'process';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetStaffByIdQuery } from '@/ducks/staff/query';
import { useGetScheduleQuery } from '@/ducks/schedule/query';
import {
  dokoColor,
  idoColor,
  kodoColor,
  kyotakuColor,
} from '@/utils';

type EventStyleGetter = {
  color: string;
};

moment.locale('ja');
const localizer = momentLocalizer(moment);

const SchedulePage: NextPage = () => {
  const router = useRouter();
  const staffId = router.query.id as string;
  const currentDate = new Date();
  const [year, setYeart] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const { data: staffData } = useGetStaffByIdQuery(
    staffId || skipToken
  );

  const params = useMemo(() => {
    if (staffData) {
      return {
        staff_id: staffData.id,
        year: 2023,

        month: 5,
      };
    }
    return null;
  }, [year, month, staffData]);
  console.log('staffData', staffData);
  console.log('params', params);
  const { data: scheduleList, isLoading: scheduleLoading } =
    useGetScheduleQuery(params || skipToken);

  const eventStyleGetter = (event: EventStyleGetter) => ({
    style: {
      backgroundColor: event.color,
    },
  });

  const formats: Formats = {
    dateFormat: 'DD',
    dayFormat: 'D(ddd)',
    monthHeaderFormat: 'YYYY年M月',
    dayHeaderFormat: 'M月D日(ddd)',
    dayRangeHeaderFormat: ({ start, end }, culture, local) => {
      const startDate = moment.isMoment(start)
        ? start.toDate()
        : start;
      const endDate = moment.isMoment(end) ? end.toDate() : end;
      return `${local!.format(startDate, 'MMMD日')} - ${local!.format(
        endDate,
        'MMMD日'
      )}`;
    },
  };

  const formatScheduleArr = (content_arr: ScheduleContentArr[]) => {
    return content_arr.map((content) => {
      let bgColor;
      if (content.service_content === '同行援護') {
        bgColor = dokoColor;
      } else if (content.service_content === '行動援護') {
        bgColor = kodoColor;
      } else if (content.service_content === '移動支援') {
        bgColor = idoColor;
      } else {
        bgColor = kyotakuColor;
      }
      return {
        title: `${content.user_name}[${content.service_content}]`,
        start: new Date(content.start_time),
        end: new Date(content.end_time),
        color: bgColor,
      };
    });
  };
  console.log('scheduleList', scheduleList);
  return (
    <DashboardLayout title="勤怠状況">
      <PageContainer title="勤怠状況" fluid>
        {scheduleList && (
          <Calendar
            localizer={localizer}
            events={formatScheduleArr(scheduleList.content_arr)}
            defaultView="week"
            views={['week']}
            formats={formats}
            style={{ height: '100%' }}
            min={moment('07:00', 'HH:mm').toDate()}
            max={moment('23:00', 'HH:mm').toDate()}
            eventPropGetter={eventStyleGetter}
            components={{ toolbar: CustomToolbar }}
          />
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default SchedulePage;
