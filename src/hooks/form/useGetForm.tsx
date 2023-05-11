import { ContentArr, ReturnAccompany } from '@/ducks/accompany/slice';
import { calcWorkTime } from '@/utils';
import { UseFormReturnType, useForm } from '@mantine/form';
import { ChangeEvent, useEffect } from 'react';

export type UseGetFormType<T> = {
  form: UseFormReturnType<T>;
  handleChangeDate: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  handleChangeStaff: (staffName: string, index: number) => void;
  handleChangeTime: (start_time: Date, end_time: Date, index: number) => void;
  handleRefresh: (index: number) => void;
  amountTime: number;
};

export const useGetForm = (
  createInitialState: any,
  getData: any,
  refetch: any,
  validateRules: any
) => {
  const currentDate = new Date();
  const form = useForm({
    initialValues: {
      ...createInitialState,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      content_arr: Array.from(
        { length: 31 },
        () => createInitialState.content_arr[0]
      ),
    },
    validate: validateRules,
  });

  // useFormは再レンダリングされないので
  useEffect(() => {
    if (!getData) return;
    refetch();
    const newContentArr = [
      ...getData.content_arr,
      ...Array.from(
        { length: 31 - getData.content_arr.length },
        () => createInitialState.content_arr[0]
      ),
    ];
    form.setValues({
      ...getData,
      content_arr: newContentArr,
    });
  }, [getData]);

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
    const formatStartTime = new Date(
      form.values.year,
      form.values.month - 1,
      form.values.content_arr[index].work_date,
      start_time.getHours(),
      start_time.getMinutes(),
      start_time.getSeconds()
    ).toString();
    const formatEndTime = new Date(
      form.values.year,
      form.values.month - 1,
      form.values.content_arr[index].work_date,
      end_time.getHours(),
      end_time.getMinutes(),
      end_time.getSeconds()
    ).toString();
    const newContentArr = form.values.content_arr.map(
      (content: ContentArr, contentIndex: number) => {
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
      return sum + Number(calcWorkTime(content.start_time, content.end_time));
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
