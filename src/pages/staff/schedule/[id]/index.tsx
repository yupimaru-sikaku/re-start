import { CustomButton } from '@/components/Common/CustomButton';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { StaffList } from '@/components/Staff/StaffList';
import { ReturnStaff } from '@/ducks/staff/slice';
import { getDb, supabase } from '@/libs/supabase/supabase';
import { getPath } from '@/utils/const/getPath';
import { Box, Group, Space } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';

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
import { ReturnStaffSchedule } from '@/ducks/staff-schedule/slice';
import { title } from 'process';

type EventStyleGetter = {
  color: string;
};

moment.locale('ja');
const localizer = momentLocalizer(moment);

const StaffPersonalSchedulePage: NextPage = () => {
  const currentDate = new Date();
  const [year, setYeart] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [staffName, setStaffName] = useState('渡辺真由美');
  const [scheduleList, setScheduleList] = useState<any>();
  const getScheduleList = async () => {
    const { data, error } = await supabase
      .from(getDb('STAFF_SCHEDULE'))
      .select('*')
      .eq('year', year)
      .eq('month', month)
      .eq('staff_name', staffName);
    if (data) {
      setScheduleList(data[0]);
    }
  };

  useEffect(() => {
    getScheduleList();
  }, [year, month]);

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
      const startDate = moment.isMoment(start) ? start.toDate() : start;
      const endDate = moment.isMoment(end) ? end.toDate() : end;
      return `${local!.format(startDate, 'MMMD日')} - ${local!.format(
        endDate,
        'MMMD日'
      )}`;
    },
  };

  const formatScheduleArr = (
    content_arr: ReturnStaffSchedule['content_arr']
  ) => {
    if (!content_arr) return [];
    return content_arr.map((content) => {
      return {
        title: `${content.user_name}[${content.service_content}]`,
        start: new Date(content.start_time),
        end: new Date(content.end_time),
        color: '#F00',
      };
    });
  };
  return (
    <DashboardLayout title="勤怠状況">
      <PageContainer title="勤怠状況" fluid>
        <Space h="md" />
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

export default StaffPersonalSchedulePage;
