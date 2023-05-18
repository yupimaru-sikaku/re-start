import React from 'react';
import { convertSupabaseTime } from '@/utils';
import { ActionIcon, Checkbox, Group } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { IconEdit } from '@tabler/icons';
import { CustomButton } from '../Common/CustomButton';
import { ReturnStaff } from '@/ducks/staff/slice';
import Link from 'next/link';
import { getPath } from '@/utils/const/getPath';

type Props = {
  handleDelete: (id: string) => Promise<void>;
};

export const StaffListRecords = ({ handleDelete }: Props) => {
  return [
    { accessor: 'name', title: '名前', width: 110 },
    { accessor: 'gender', title: '性別', width: 50 },
    {
      accessor: 'work_time_per_week',
      title: '勤務時間/週',
      width: 70,
    },
    {
      accessor: 'syoninsya',
      width: 50,
      title: '初任者',
      render: (staff: ReturnStaff) => <Checkbox readOnly checked={staff.is_syoninsya} />,
    },
    {
      accessor: 'kodo',
      width: 50,
      title: (
        <>
          行動
          <br />
          援護
        </>
      ),
      render: (staff: ReturnStaff) => <Checkbox readOnly checked={staff.is_kodo} />,
    },
    {
      accessor: 'doko_normal',
      width: 70,
      title: (
        <>
          同行援護
          <br />
          一般
        </>
      ),
      render: (staff: ReturnStaff) => <Checkbox readOnly checked={staff.is_doko_normal} />,
    },
    {
      accessor: 'doko_apply',
      width: 70,
      title: (
        <>
          同行援護
          <br />
          応用
        </>
      ),
      render: (staff: ReturnStaff) => <Checkbox readOnly checked={staff.is_doko_apply} />,
    },
    {
      accessor: 'iitsumusya',
      width: 50,
      title: '実務者',
      render: (staff: ReturnStaff) => <Checkbox readOnly checked={staff.is_zitsumusya} />,
    },
    {
      accessor: 'kaigo',
      width: 70,
      title: (
        <>
          介護
          <br />
          福祉士
        </>
      ),
      render: (staff: ReturnStaff) => <Checkbox readOnly checked={staff.is_kaigo} />,
    },
    {
      accessor: 'move',
      title: '勤怠状況',
      width: 100,
      render: (staff: ReturnStaff) => (
        <Link href={getPath('STAFF_SCHEDULE', staff.id)}>
          <a>
            <CustomButton color="cyan" variant="light">
              勤怠状況
            </CustomButton>
          </a>
        </Link>
      ),
    },
    {
      accessor: 'actions',
      title: 'アクション',
      width: 90,
      render: (staff: ReturnStaff) => (
        <Group spacing={4} noWrap>
          <Link href={getPath('STAFF_EDIT', staff.id)}>
            <a>
              <ActionIcon color="blue">
                <IconEdit size={20} />
              </ActionIcon>
            </a>
          </Link>
          <ActionIcon color="red" onClick={() => handleDelete(staff.id)}>
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      ),
    },
    {
      accessor: 'updatedAt',
      title: '更新日時',
      width: 150,
      render: (staff: ReturnStaff) => convertSupabaseTime(staff.updated_at),
    },
  ];
};
