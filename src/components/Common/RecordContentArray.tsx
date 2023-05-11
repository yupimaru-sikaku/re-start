import { ContentArr } from '@/ducks/accompany/slice';
import { RootState } from '@/ducks/root-reducer';
import { ReturnStaff } from '@/ducks/staff/slice';
import { useSelector } from '@/ducks/store';
import { calcWorkTime, convertWeekItem } from '@/utils';
import { ActionIcon, Paper, Select, Table, TextInput } from '@mantine/core';
import { TimeRangeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { IconClock, IconRefresh } from '@tabler/icons';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  form: UseFormReturnType<any>;
  handleChangeDate: any;
  handleChangeTime: any;
  staffList: ReturnStaff[];
  handleChangeStaff: any;
  handleRefresh: any;
};

export const RecordContentArray: NextPage<Props> = ({
  form,
  handleChangeDate,
  handleChangeTime,
  staffList,
  handleChangeStaff,
  handleRefresh,
}) => {
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const convertTimeRange = (
    content: ContentArr
  ): [Date | null, Date | null] => {
    if (content.start_time) {
      return [new Date(content.start_time), new Date(content.end_time)];
    }
    return [null, null];
  };

  return (
    <Paper sx={{ overflowX: 'auto' }}>
      <Table sx={{ width: '800px' }}>
        <thead>
          <tr>
            <th style={{ width: '100px' }}>日付</th>
            <th style={{ width: '100px' }}>曜日</th>
            <th style={{ width: '200px' }}>開始-終了時間</th>
            <th style={{ width: '170px' }}>算定時間数</th>
            {loginProviderInfo.role === 'admin' && (
              <th style={{ width: '200px' }}>スタッフ名</th>
            )}
            <th style={{ width: '80px' }}>リセット</th>
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
                />
              </td>
              <td>
                <TextInput
                  sx={{
                    '& input:disabled': { color: 'black' },
                  }}
                  value={convertWeekItem(
                    form.values.year,
                    form.values.month,
                    content.work_date
                  )}
                  variant="filled"
                  disabled
                />
              </td>
              <td>
                <TimeRangeInput
                  icon={<IconClock size={16} />}
                  variant="filled"
                  value={convertTimeRange(content)}
                  onChange={(e) => handleChangeTime(e[0], e[1], index)}
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
                    onChange={(staffName: string) =>
                      handleChangeStaff(staffName, index)
                    }
                  />
                </td>
              )}
              <td>
                <ActionIcon onClick={() => handleRefresh(index)}>
                  <IconRefresh />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};
