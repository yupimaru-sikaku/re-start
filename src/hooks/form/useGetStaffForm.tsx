import { useRouter } from 'next/router';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { CustomConfirm } from '@/components/Common/CustomConfirm';
import { UseFormReturnType, useForm } from '@mantine/form';
import { useCreateStaffMutation, useUpdateStaffMutation } from '@/ducks/staff/query';
import { CreateStaffParams, CreateStaffResult, ReturnStaff, UpdateStaffResult } from '@/ducks/staff/slice';
import { BaseQueryFn, MutationDefinition } from '@rtk-incubator/rtk-query/dist';
import { useEffect } from 'react';

export type UseGetStaffFormType = {
  form: UseFormReturnType<CreateStaffParams>;
  recordSubmit: MutationDefinition<CreateStaffParams, BaseQueryFn, 'Staff', ReturnStaff, 'staffApi'>;
};

type GetFormType = {
  type: 'create' | 'edit';
  createInitialState: CreateStaffParams;
  validate: any;
};

type RecordSubmitResult = {
  isFinished: boolean;
  message: string;
};

export const useGetStaffForm = ({ type, createInitialState, validate }: GetFormType) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const router = useRouter();
  const staffId = router.query.id as string;
  const staffList = useSelector((state) => state.staff.staffList);
  const staffData = staffList.find((staff) => staff.id === staffId);
  const form = useForm({
    initialValues: createInitialState,
    validate: validate,
  });
  const loginProviderInfo = useSelector((state: RootState) => state.provider.loginProviderInfo);
  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();

  // useFormは再レンダリングされないので更新時は再取得
  useEffect(() => {
    if (!staffData) return;
    form.setValues(staffData);
  }, [staffData]);

  // 登録・更新メソッド
  const recordSubmit = async (): Promise<RecordSubmitResult> => {
    const isOK = await CustomConfirm(`スタッフ情報を${TITLE}しますか？後から修正は可能です。`, '確認画面');
    if (!isOK) return { isFinished: false, message: '' };
    try {
      const createParams: CreateStaffParams = {
        ...form.values,
        login_id: loginProviderInfo.id,
      };
      const { error } =
        type === 'create'
          ? ((await createStaff(createParams)) as CreateStaffResult)
          : ((await updateStaff({ ...createParams, id: staffId })) as UpdateStaffResult);
      if (error) {
        throw new Error(`スタッフの${TITLE}に失敗しました。`);
      }
      return { isFinished: true, message: '' };
    } catch (error: any) {
      return { isFinished: false, message: error.message };
    }
  };

  return {
    form,
    staffData,
    recordSubmit,
  };
};
