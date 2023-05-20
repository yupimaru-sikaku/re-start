import { CreateStaffParams } from '@/ducks/staff/slice';
import { UseFormReturnType } from '@mantine/form';

export const useGetQualificationList = (form: UseFormReturnType<CreateStaffParams>) => {
  return [
    {
      title: '初任者研修',
      formTitle: 'is_syoninsya',
      formValue: form.values.is_syoninsya,
    },
    {
      title: '行動援護',
      formTitle: 'is_kodo',
      formValue: form.values.is_kodo,
    },
    {
      title: '同行援護一般',
      formTitle: 'is_doko_normal',
      formValue: form.values.is_doko_normal,
    },
    {
      title: '同行援護応用',
      formTitle: 'is_doko_apply',
      formValue: form.values.is_doko_apply,
    },
    {
      title: '実務者研修',
      formTitle: 'is_zitsumusya',
      formValue: form.values.is_zitsumusya,
    },
    {
      title: '介護福祉士',
      formTitle: 'is_kaigo',
      formValue: form.values.is_kaigo,
    },
  ];
};
