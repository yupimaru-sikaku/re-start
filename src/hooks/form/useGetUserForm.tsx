import { useRouter } from 'next/router';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { CustomConfirm } from '@/components/Common/CustomConfirm';
import { UseFormReturnType, useForm } from '@mantine/form';
import { useCreateUserMutation, useUpdateUserMutation } from '@/ducks/user/query';
import { CreateUserParams, CreateUserResult, ReturnUser, UpdateUserResult } from '@/ducks/user/slice';
import { BaseQueryFn, MutationDefinition } from '@rtk-incubator/rtk-query/dist';
import { useEffect } from 'react';

export type UseGetUserFormType = {
  form: UseFormReturnType<CreateUserParams>;
  recordSubmit: MutationDefinition<CreateUserParams, BaseQueryFn, 'User', ReturnUser, 'userApi'>;
};

type GetFormType = {
  type: 'create' | 'edit';
  createInitialState: CreateUserParams;
  validate: any;
};

type RecordSubmitResult = {
  isFinished: boolean;
  message: string;
};

export const useGetUserForm = ({ type, createInitialState, validate }: GetFormType) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const router = useRouter();
  const userId = router.query.id as string;
  const userList = useSelector((state) => state.user.userList);
  const userData = userList.find((user) => user.id === userId);
  const form = useForm({
    initialValues: createInitialState,
    validate: validate,
  });
  const loginProviderInfo = useSelector((state: RootState) => state.provider.loginProviderInfo);
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // useFormは再レンダリングされないので更新時は再取得
  useEffect(() => {
    if (!userData) return;
    form.setValues(userData);
  }, [userData]);

  // 登録・更新メソッド
  const recordSubmit = async (): Promise<RecordSubmitResult> => {
    const isOK = await CustomConfirm(`利用者情報を${TITLE}しますか？後から修正は可能です。`, '確認画面');
    if (!isOK) return { isFinished: false, message: '' };
    try {
      const createParams: CreateUserParams = {
        ...form.values,
        login_id: loginProviderInfo.id,
        corporate_id: loginProviderInfo.corporate_id,
      };
      const { error } =
        type === 'create'
          ? ((await createUser(createParams)) as CreateUserResult)
          : ((await updateUser({ ...createParams, id: userId })) as UpdateUserResult);
      if (error) {
        throw new Error(`利用者の${TITLE}に失敗しました。`);
      }
      return { isFinished: true, message: '' };
    } catch (error: any) {
      return { isFinished: false, message: error.message };
    }
  };

  return {
    form,
    userData,
    recordSubmit,
  };
};
