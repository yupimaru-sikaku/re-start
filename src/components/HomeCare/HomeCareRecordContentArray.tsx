import { ContentArr } from '@/ducks/common-service/slice';
import { CreateHomeCareParams } from '@/ducks/home-care/slice';
import { ReturnStaff } from '@/ducks/staff/slice';
import { useSelector } from '@/ducks/store';
import { ReturnUser } from '@/ducks/user/slice';
import { KAZI, SHINTAI, TSUIN, WITH_TSUIN, calcWorkTime, convertWeekItem } from '@/utils';
import { ActionIcon, Group, Overlay, Paper, Select, Table, TextInput } from '@mantine/core';
import { TimeRangeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { IconClock, IconRefresh } from '@tabler/icons';
import React, { ChangeEvent, FC } from 'react';

type Props = {
  form: UseFormReturnType<CreateHomeCareParams>;
  staffList: ReturnStaff[];
  userList: ReturnUser[];
  handleChangeDate: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  handleChangeService: (serviceContent: string | null, index: number) => void;
  handleChangeTime: (time: Date[], index: number) => void;
  handleChangeStaff: (staffName: string, index: number) => void;
  handleRefresh: (index: number) => void;
};

export const HomeCareRecordContentArray: FC<Props> = ({
  form,
  staffList,
  userList,
  handleChangeDate,
  handleChangeService,
  handleChangeTime,
  handleChangeStaff,
  handleRefresh,
}) => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);
  const selectedUser = userList.find((user) => user.name === form.values.user_name);
  const convertTimeRange = (content: ContentArr): [Date | null, Date | null] => {
    if (content.start_time && content.end_time) {
      return [new Date(content.start_time), new Date(content.end_time)];
    }
    return [null, null];
  };

  const serviceList = [
    ...(selectedUser?.is_kazi ? [KAZI] : []),
    ...(selectedUser?.is_shintai ? [SHINTAI] : []),
    ...(selectedUser?.is_tsuin ? [TSUIN] : []),
    ...(selectedUser?.is_with_tsuin ? [WITH_TSUIN] : []),
  ];

  return (
    <Paper sx={{ overflowX: 'auto', position: 'relative' }}>
      <Table sx={{ width: '950px' }}>
        <thead>
          <tr>
            <th style={{ width: '100px' }}>日付</th>
            <th style={{ width: '100px' }}>曜日</th>
            <th style={{ width: '250px' }}>サービス種類</th>
            <th style={{ width: '100px' }}>開始-終了時間</th>
            <th style={{ width: '100px' }}>算定時間数</th>
            {loginProviderInfo.role === 'admin' && <th style={{ width: '200px' }}>スタッフ名</th>}
            <th style={{ width: '100px' }}>リセット</th>
          </tr>
        </thead>
        <tbody>
          {form.values.content_arr.map((content: ContentArr, index: number) => (
            <tr key={index}>
              <td>
                <TextInput
                  variant="filled"
                  maxLength={2}
                  value={content.work_date || ''}
                  onChange={(e) => handleChangeDate(e, index)}
                  pattern="\d*"
                />
              </td>
              <td>
                <TextInput
                  sx={{
                    '& input:disabled': { color: 'black' },
                  }}
                  value={convertWeekItem(form.values.year, form.values.month, content.work_date)}
                  variant="filled"
                  disabled
                />
              </td>
              <td>
                <Select
                  variant="filled"
                  label=""
                  data={serviceList || []}
                  value={content.service_content}
                  onChange={(service) => handleChangeService(service, index)}
                />
              </td>
              <td>
                <TimeRangeInput
                  icon={<IconClock size={16} />}
                  variant="filled"
                  value={convertTimeRange(content)}
                  onChange={(e) => handleChangeTime(e, index)}
                />
              </td>
              <td>
                <TextInput
                  sx={{
                    '& input:disabled': { color: 'black' },
                  }}
                  value={calcWorkTime(content.start_time, content.end_time)}
                  variant="filled"
                  disabled
                />
              </td>
              {loginProviderInfo.role === 'admin' && (
                <td>
                  <Select
                    searchable
                    nothingFound="No Data"
                    data={staffList.map((staff) => staff.name)}
                    value={content.staff_name}
                    variant="filled"
                    onChange={(staffName: string) => handleChangeStaff(staffName, index)}
                  />
                </td>
              )}
              <td>
                <Group position="center">
                  <ActionIcon onClick={() => handleRefresh(index)}>
                    <IconRefresh />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};
