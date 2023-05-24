import { CustomConfirm } from '@/components/Common/CustomConfirm';
import { RootState } from '@/ducks/root-reducer';
import { useCreateScheduleMutation, useGetScheduleListQuery, useUpdateScheduleMutation } from '@/ducks/schedule/query';
import { useSelector } from '@/ducks/store';
import { calcWorkTime } from '@/utils';
import { UseFormReturnType, useForm } from '@mantine/form';
import { ChangeEvent, useEffect } from 'react';
import { checkOverlap } from './checkOverlap';
import { CreateScheduleResult, UpdateScheduleParams, UpdateScheduleResult } from '@/ducks/schedule/slice';
import { ContentArr } from '@/ducks/common-service/slice';

export type UseGetFormType<T> = {
  form: UseFormReturnType<T>;
  handleChangeDate: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  handleChangeStaff: (staffName: string, index: number) => void;
  handleChangeTime: (time: Date[], index: number) => void;
  handleRefresh: (index: number) => void;
  amountTime: number;
  recordSubmit: any;
};

type GetFormType = {
  type: 'create' | 'edit';
  SERVICE_CONTENT: '同行援護' | '行動援護' | '移動支援';
  createInitialState: any;
  recordData: any;
  refetch: any;
  validate: any;
};

type RecordSumbitParams = {
  createRecord: any;
  updateRecord: any;
};

type RecordSubmitResult = {
  isFinished: boolean;
  message: string;
};

export const useGetForm = ({ type, SERVICE_CONTENT, createInitialState, recordData, refetch, validate }: GetFormType) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const currentDate = new Date();
  const form = useForm({
    initialValues: {
      ...createInitialState,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      content_arr: Array.from({ length: 31 }, () => createInitialState.content_arr[0]),
    },
    validate: validate,
  });
  const loginProviderInfo = useSelector((state: RootState) => state.provider.loginProviderInfo);
  const userList = useSelector((state: RootState) => state.user.userList);
  const staffList = useSelector((state: RootState) => state.staff.staffList);
  const selectedUser = userList.find((user) => user.name === form.values.user_name);
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const { data: scheduleList = [], refetch: scheduleRefetch } = useGetScheduleListQuery();

  // useFormは再レンダリングされないので更新時は再取得
  useEffect(() => {
    if (!recordData) return;
    refetch();
    const newContentArr = [
      ...recordData.content_arr,
      ...Array.from({ length: 31 - recordData.content_arr.length }, () => createInitialState.content_arr[0]),
    ];
    form.setValues({
      ...recordData,
      content_arr: newContentArr,
    });
  }, [recordData]);

  // 日付を入力した場合
  const handleChangeDate = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newContentArr = form.values.content_arr.map((content: ContentArr, contentIndex: number) => {
      return contentIndex === index
        ? {
            ...content,
            work_date: Number(e.target.value),
          }
        : content;
    });
    form.setFieldValue('content_arr', newContentArr);
  };

  // スタッフを入力した時
  const handleChangeStaff = (staffName: string, index: number) => {
    const newContentArr = form.values.content_arr.map((content: ContentArr, contentIndex: number) => {
      return contentIndex === index
        ? {
            ...content,
            staff_name: staffName,
          }
        : content;
    });
    form.setFieldValue('content_arr', newContentArr);
  };

  // 時間を入力した時
  const handleChangeTime = (time: Date[], index: number) => {
    const startTime = time[0];
    const endTime = time[1];
    if (!startTime || !endTime) return;
    const formatStartTime = new Date(
      form.values.year,
      form.values.month - 1,
      form.values.content_arr[index].work_date,
      startTime.getHours(),
      startTime.getMinutes(),
      startTime.getSeconds()
    ).toString();
    const formatEndTime = new Date(
      form.values.year,
      form.values.month - 1,
      form.values.content_arr[index].work_date,
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds()
    ).toString();
    const newContentArr = form.values.content_arr.map((content: ContentArr, contentIndex: number) => {
      return contentIndex === index
        ? {
            ...content,
            start_time: formatStartTime,
            end_time: formatEndTime,
          }
        : content;
    });
    form.setFieldValue('content_arr', newContentArr);
  };

  // リセットボタンを押した時
  const handleRefresh = (index: number) => {
    const newContentArr = form.values.content_arr.map((content: ContentArr, contentIndex: number) => {
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
    });
    form.setFieldValue('content_arr', newContentArr);
  };

  // 合計勤務時間
  const amountTime = form.values.content_arr.reduce((sum: number, content: ContentArr) => {
    if (content.start_time === '' || content.end_time === '') {
      return sum;
    }
    return sum + Number(calcWorkTime(content.start_time, content.end_time));
  }, 0);

  // 登録・更新メソッド
  const recordSubmit = async ({ createRecord, updateRecord }: RecordSumbitParams): Promise<RecordSubmitResult> => {
    const isOK = await CustomConfirm(`実績記録票を${TITLE}しますか？後から修正は可能です。`, '確認画面');
    if (!isOK) return { isFinished: false, message: '' };
    // 空欄がある場合に除外して市区町村とサービス種別を加えて日付順にソート
    const formatArr: ContentArr[] = form.values.content_arr
      .filter((content: ContentArr) => {
        return content.work_date && content.start_time && content.end_time;
      })
      .map((content: ContentArr) => {
        return {
          ...content,
          city: selectedUser!.city,
          service_content: SERVICE_CONTENT,
        };
      })
      .sort((a: ContentArr, b: ContentArr) => a.work_date! - b.work_date!);
    // スタッフの名前毎に配列を作成した作成した新しい配列を作成[][]
    const format2DArr = Object.values(
      formatArr.reduce<{
        [key: string]: ContentArr[];
      }>((result, currentValue) => {
        if (currentValue['staff_name'] !== null && currentValue['staff_name'] !== undefined) {
          (result[currentValue['staff_name']] = result[currentValue['staff_name']] || []).push(currentValue);
        }
        return result;
      }, {})
    );
    if (formatArr.length === 0) {
      return {
        isFinished: false,
        message: '記録は、少なくとも一行は作成ください。',
      };
    }
    // カレンダーが重複していないか確認
    if (loginProviderInfo.role === 'admin') {
      const errorMessageList = checkOverlap(
        format2DArr,
        scheduleList,
        selectedUser,
        SERVICE_CONTENT,
        form.values.year,
        form.values.month
      );
      if (errorMessageList.length) {
        return {
          isFinished: false,
          message: `スケジュールの時間が重複しています。${errorMessageList.join(' ')}`,
        };
      }
    }

    try {
      // 記録票の作成・更新
      const createRecordParams = {
        ...form.values,
        login_id: loginProviderInfo.id,
        corporate_id: loginProviderInfo.corporate_id,
        identification: selectedUser!.identification,
        content_arr: formatArr,
      };
      const { createRecordError } =
        type === 'create'
          ? await createRecord(createRecordParams)
          : await updateRecord({
              ...createRecordParams,
              id: recordData!.id,
            });
      if (createRecordError) {
        throw new Error(`記録票の${TITLE}に失敗しました。${createRecordError.message}`);
      }
      // スタッフのスケジュールの作成・更新
      const allStaffNameEmpty = format2DArr.every((subArray) => subArray.every((content) => content.staff_name === ''));
      if (loginProviderInfo.role === 'admin' && !allStaffNameEmpty) {
        format2DArr.map(async (contentList) => {
          const staffName = contentList[0].staff_name;
          const selectedStaff = staffList.find((staff) => staff.name === staffName);
          const selectedSchedule = scheduleList.find(
            (schedule) =>
              schedule.year === form.values.year && schedule.month === form.values.month && schedule.staff_name === staffName
          );
          let newContentArr = [];
          if (selectedSchedule) {
            const removeContentArr = selectedSchedule.content_arr.filter(
              (content) => content.user_name !== selectedUser!.name || content.service_content !== SERVICE_CONTENT
            );
            const contentNewList = contentList.map((content) => {
              let { staff_name, ...rest } = content;
              return { ...rest, user_name: selectedUser!.name };
            });
            newContentArr = [...removeContentArr, ...contentNewList];
          } else {
            newContentArr = contentList.map((content) => {
              let { staff_name, ...rest } = content;
              return { ...rest, user_name: selectedUser!.name };
            });
          }
          const createScheduleParams = {
            staff_id: selectedStaff!.id,
            staff_name: selectedStaff!.name,
            year: form.values.year,
            month: form.values.month,
            content_arr: newContentArr,
          };
          const { error } = selectedSchedule
            ? ((await updateSchedule({
                ...createScheduleParams,
                id: selectedSchedule.id,
              })) as UpdateScheduleResult)
            : ((await createSchedule(createScheduleParams)) as CreateScheduleResult);
          if (error) {
            throw new Error(`スタッフのスケジュール${TITLE}に失敗しました。${error.message}`);
          }
        });
      }
      // 更新前には名前があったが、更新時に名前が無くなったスタッフのスケジュールを削除
      if (loginProviderInfo.role === 'admin') {
        const oldStaffList: string[] =
          recordData?.content_arr
            .filter(
              (content: ContentArr, index: number, self: ContentArr[]) =>
                content.staff_name !== '' && self.findIndex((c: ContentArr) => c.staff_name === content.staff_name) === index
            )
            .map((content: ContentArr) => content.staff_name) || [];
        const targetStaffList =
          oldStaffList.filter(
            (staffName) =>
              !form.values.content_arr.some(
                (content: ContentArr) => content.staff_name === staffName && content.staff_name !== ''
              )
          ) || [];
        const promiseResultList = await Promise.allSettled(
          targetStaffList.map(async (staffName) => {
            const selectedStaff = staffList?.find((staff) => staff.name === staffName);
            const selectedSchedule = scheduleList.find(
              (schedule) =>
                schedule.year === form.values.year && schedule.month === form.values.month && schedule.staff_name === staffName
            );
            const newContentArr = selectedSchedule!.content_arr.filter(
              (content) => content.user_name !== form.values.user_name
            );
            const updateParams: UpdateScheduleParams = {
              id: selectedSchedule!.id,
              staff_name: staffName,
              staff_id: selectedStaff!.id,
              year: form.values.year,
              month: form.values.month,
              content_arr: newContentArr,
            };
            return await updateSchedule(updateParams);
          })
        );
        promiseResultList.map((promiseResult) => {
          if (promiseResult.status === 'rejected') {
            return { isFinished: false, message: promiseResult.reason };
          }
        });
      }
      scheduleRefetch();
      return { isFinished: true, message: '' };
    } catch (error: any) {
      return { isFinished: false, message: error.message };
    }
  };

  return {
    form,
    handleChangeDate,
    handleChangeStaff,
    handleChangeTime,
    handleRefresh,
    amountTime,
    recordSubmit,
  };
};
