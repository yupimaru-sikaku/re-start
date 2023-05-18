import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { Badge, LoadingOverlay, Paper, SimpleGrid, Space, Text } from '@mantine/core';
import moment from 'moment';
import { Calendar, Formats, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ja';
import { CustomToolbar } from '@/components/StaffSchedule/CustomToolbar';
import { ScheduleContentArr } from '@/ducks/schedule/slice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetScheduleQuery } from '@/ducks/schedule/query';
import { dokoColor, idoColor, kodoColor, kyotakuColor } from '@/utils';
import { useSelector } from '@/ducks/store';

moment.locale('ja');
const localizer = momentLocalizer(moment);

const SchedulePage: NextPage = () => {
  const router = useRouter();
  const staffId = router.query.id as string;
  const currentDate = new Date();
  const [year, setYeart] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const staffList = useSelector((state) => state.staff.staffList);
  const selectedStaffName = staffList.find((staff) => staff.id === staffId)?.name || '';
  const staffData = useSelector((state) => state.staff.staffData);
  const scheduleData = useSelector((state) => state.schedule.scheduleData);
  const params = useMemo(() => {
    if (staffData) {
      return {
        staff_id: staffData.id,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      };
    }
    return null;
  }, [year, month, staffData]);
  const { isLoading: scheduleLoading } = useGetScheduleQuery(params || skipToken);

  const eventStyleGetter = (event: { color: string }) => ({
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
      return `${local!.format(startDate, 'MMMD日')} - ${local!.format(endDate, 'MMMD日')}`;
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
        textColor: 'black',
        color: bgColor,
      };
    });
  };

  return (
    <DashboardLayout title={`勤怠状況（${selectedStaffName}）`}>
      <LoadingOverlay className="relative" visible={scheduleLoading} />
      <PageContainer title={`勤怠状況（${selectedStaffName}）`} fluid>
        {scheduleData ? (
          <>
            <Calendar
              localizer={localizer}
              events={formatScheduleArr(scheduleData.content_arr)}
              defaultView="week"
              views={['week']}
              formats={formats}
              style={{ height: '100%' }}
              min={moment('07:00', 'HH:mm').toDate()}
              max={moment('22:00', 'HH:mm').toDate()}
              eventPropGetter={eventStyleGetter}
              components={{ toolbar: CustomToolbar }}
            />
            <Space h="md" />
            <SimpleGrid breakpoints={[{ minWidth: 'xs', cols: 4 }]}>
              <Badge variant="filled" sx={{ backgroundColor: dokoColor }}>
                同行援護
              </Badge>
              <Badge variant="filled" sx={{ backgroundColor: kodoColor }}>
                行動援護
              </Badge>
              <Badge variant="filled" sx={{ backgroundColor: idoColor }}>
                移動支援
              </Badge>
              <Badge variant="filled" sx={{ backgroundColor: kyotakuColor }}>
                居宅介護
              </Badge>
            </SimpleGrid>
          </>
        ) : (
          <Paper shadow="xs" p="md">
            <Text>データが存在しません</Text>
          </Paper>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default SchedulePage;
