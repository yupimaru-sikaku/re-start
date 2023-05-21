import React, { useState } from 'react';
import { NextPage } from 'next';
import { DashboardLayout } from '@/components/Layout/DashboardLayout/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { Badge, LoadingOverlay, Paper, SimpleGrid, Space, Text } from '@mantine/core';
import moment from 'moment';
import { Calendar, Formats, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ja';
import { CustomToolbar } from '@/components/StaffSchedule/CustomToolbar';
import { ScheduleContentArr } from '@/ducks/schedule/slice';
import { calcWorkTime, dokoColor, idoColor, kodoColor, kyotakuColor, splitByWeeks } from '@/utils';
import { useSelector } from '@/ducks/store';
import { useRouter } from 'next/router';

moment.locale('ja');
const localizer = momentLocalizer(moment);

const ScheduleDetailPage: NextPage = () => {
  const router = useRouter();
  const scheduleId = router.query.id as string;
  const currentDate = new Date();
  const [year, setYeart] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const scheduleList = useSelector((state) => state.schedule.scheduleList);
  const selectedSchedule = scheduleList.find((schedule) => schedule.id === scheduleId);
  const staffName = selectedSchedule?.staff_name || '';

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
        title: `${content.user_name}`,
        start: new Date(content.start_time),
        end: new Date(content.end_time),
        textColor: 'black',
        color: bgColor,
      };
    });
  };

  const amountTime =
    selectedSchedule?.content_arr.reduce((sum: number, content: ScheduleContentArr) => {
      if (content.start_time === '' || content.end_time === '') {
        return sum;
      }
      return sum + Number(calcWorkTime(content.start_time, content.end_time));
    }, 0) || 0;

  const timePerWeekList = splitByWeeks(selectedSchedule, year, month);

  return (
    <DashboardLayout title={`勤怠状況（${staffName}）`}>
      <LoadingOverlay className="relative" visible={!selectedSchedule} />
      <PageContainer title={`勤怠状況（${staffName}）`} fluid>
        {selectedSchedule && (
          <>
            <Text>
              {month}月の合計時間：{amountTime}時間
            </Text>
            <SimpleGrid
              breakpoints={[
                { minWidth: 'sm', cols: 2 },
                { minWidth: 'md', cols: 6 },
                { minWidth: 'xl', cols: 8 },
              ]}
            >
              {timePerWeekList.map((time, index) => (
                <Text key={index}>{`${index + 1}週目：${time.toString()}時間`}</Text>
              ))}
            </SimpleGrid>
            <Space h="sm" />
            <Calendar
              localizer={localizer}
              events={formatScheduleArr(selectedSchedule.content_arr)}
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
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default ScheduleDetailPage;
