import { useRouter } from 'next/router';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';
import { CustomConfirm } from '@/components/Common/CustomConfirm';
import { UseFormReturnType, useForm } from '@mantine/form';
import { BaseQueryFn, MutationDefinition } from '@rtk-incubator/rtk-query/dist';
import { useEffect, useMemo } from 'react';
import { CreateProviderParams, CreateProviderWithSignUpParams, ReturnProvider } from '@/ducks/provider/slice';
import { useCreateProviderWithSignUpMutation, useUpdateProviderMutation } from '@/ducks/provider/query';
import { UpdateProviderParams } from '@/ducks/provider/slice';
import { validate } from '@/utils/validate/provider';

export type UseGetProviderFormType = {
  form: UseFormReturnType<CreateProviderParams>;
  recordSubmit: MutationDefinition<CreateProviderParams, BaseQueryFn, 'Provider', ReturnProvider, 'staffApi'>;
};

type GetFormType = {
  type: 'create' | 'edit';
  createInitialState: CreateProviderParams;
  validate: typeof validate;
};

type RecordSubmitResult = {
  isFinished: boolean;
  message: string;
};

export const useGetProviderForm = ({ type, createInitialState, validate }: GetFormType) => {
  const TITLE = type === 'create' ? '登録' : '更新';
  const router = useRouter();
  const providerId = router.query.id as string;
  const loginProviderInfo = useSelector((state: RootState) => state.provider.loginProviderInfo);
  const providerList = useSelector((state) => state.provider.providerList);
  const providerData = providerList.find((provider) => provider.id === providerId);
  const form = useForm({
    initialValues: {
      ...createInitialState,
      user_id: loginProviderInfo.id,
      corporate_id: loginProviderInfo.corporate_id,
      corporate_name: loginProviderInfo.corporate_name,
    },
    validate: validate(type),
  });

  const [createProviderWithSignUp] = useCreateProviderWithSignUpMutation();
  const [updateProvider] = useUpdateProviderMutation();

  // useFormは再レンダリングされないので更新時は再取得
  useEffect(() => {
    if (!providerData) return;
    form.setValues(providerData);
  }, [providerData]);

  // 登録・更新メソッド
  const recordSubmit = async (): Promise<RecordSubmitResult> => {
    const isOK = await CustomConfirm(`事業所情報を${TITLE}しますか？`, '確認画面');
    if (!isOK) return { isFinished: false, message: '' };
    const isDuplicateOfficeName = providerList.some(
      (provider) => provider.office_name === form.values.office_name && providerData?.office_name !== form.values.office_name
    );
    if (isDuplicateOfficeName) return { isFinished: false, message: '既に登録されている事業所名です' };
    try {
      if (type === 'create') {
        const signUpParams: CreateProviderWithSignUpParams = {
          email: form.values.email,
          password: form.values.password,
          password_confirmation: form.values.password_confirmation,
        };
        const { data: signUpData, error: signUpError } = (await createProviderWithSignUp(signUpParams)) as any;
        if (signUpError) {
          throw new Error('ユーザ登録に失敗しました。');
        }
        const updateProviderParams: UpdateProviderParams = {
          id: signUpData.user.id,
          user_id: signUpData.user.id,
          corporate_id: form.values.corporate_id,
          corporate_name: form.values.corporate_name,
          office_name: form.values.office_name,
          email: form.values.email,
          role: 'office',
        };
        const { error: updateError } = (await updateProvider(updateProviderParams)) as any;
        if (updateError) {
          throw new Error(`事業所情報の${TITLE}に失敗しました。`);
        }
      } else {
        const updateProviderParams: UpdateProviderParams = {
          id: providerData!.id,
          user_id: form.values.user_id,
          corporate_id: form.values.corporate_id,
          corporate_name: form.values.corporate_name,
          office_name: form.values.office_name,
          email: form.values.email,
          role: 'office',
        };
        const { error: updateError } = (await updateProvider(updateProviderParams)) as any;
        if (updateError) {
          throw new Error(`事業所情報の${TITLE}に失敗しました。`);
        }
      }

      return { isFinished: true, message: '' };
    } catch (error: any) {
      return { isFinished: false, message: error.message };
    }
  };

  return {
    form,
    providerData,
    recordSubmit,
  };
};
