import { ContentArr } from '@/ducks/accompany/slice';
import { calcWorkTime } from '@/utils';
import { useForm } from '@mantine/form';
import React, { ChangeEvent } from 'react';

type ValidateRules<T> = {
  [K in keyof T]?: (value: T[K]) => string | null;
};

export const useGetForm = <T,>(
  createInitialState: any,
  validateRules: any
) => {
  const currentDate = new Date();
  const form = useForm({
    initialValues: {
      ...createInitialState,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      content_arr: Array.from(
        { length: 40 },
        () => createInitialState.content_arr[0]
      ),
    },
    validate: validateRules,
  });
  const handleChangeDate = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newContentArr = form.values.content_arr.map(
      (content: ContentArr, contentIndex: number) => {
        return contentIndex === index
          ? {
              ...content,
              work_date: Number(e.target.value),
              service_content: `${
                e.target.value !== '' ? '同行（初任者等）' : ''
              }`,
            }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };
  const handleChangeStaff = (staffName: string, index: number) => {
    const newContentArr = form.values.content_arr.map(
      (content: ContentArr, contentIndex: number) => {
        return contentIndex === index
          ? {
              ...content,
              staff_name: staffName,
            }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };
  const handleChangeTime = (
    start_time: Date,
    end_time: Date,
    index: number
  ) => {
    if (!start_time || !end_time) return;
    const newContentArr = form.values.content_arr.map(
      (content: ContentArr, contentIndex: number) => {
        const formatStartTime = start_time.toString();
        const formatEndTime = end_time.toString();
        return contentIndex === index
          ? {
              ...content,
              start_time: formatStartTime,
              end_time: formatEndTime,
            }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };

  const handleRefresh = (index: number) => {
    const newContentArr = form.values.content_arr.map(
      (content: ContentArr, contentIndex: number) => {
        return contentIndex === index
          ? {
              work_date: 0,
              service_content: '',
              start_time: '',
              end_time: '',
              staff_name: '',
              city: '',
            }
          : content;
      }
    );
    form.setFieldValue('content_arr', newContentArr);
  };

  const amountTime = form.values.content_arr.reduce(
    (sum: number, content: ContentArr) => {
      if (content.start_time === '' || content.end_time === '') {
        return sum;
      }
      return (
        sum +
        Number(
          calcWorkTime(
            new Date(content.start_time!),
            new Date(content.end_time!)
          )
        )
      );
    },
    0
  );
  return {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
  };
};
