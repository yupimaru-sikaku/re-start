import { KAZI, SHINTAI, TSUIN, WITH_TSUIN } from '@/utils';

export const useGetServiceList = (form: any) => {
  return [
    {
      title: '移動支援',
      formTitle: 'is_ido',
      formValue: 'ido_amount',
      form: form.values.is_ido,
    },
    {
      title: '行動援護',
      formTitle: 'is_kodo',
      formValue: 'kodo_amount',
      form: form.values.is_kodo,
    },
    {
      title: '同行援護',
      formTitle: 'is_doko',
      formValue: 'doko_amount',
      form: form.values.is_doko,
    },
    {
      title: KAZI,
      formTitle: 'is_kazi',
      formValue: 'kazi_amount',
      form: form.values.is_kazi,
    },
    {
      title: SHINTAI,
      formTitle: 'is_shintai',
      formValue: 'shintai_amount',
      form: form.values.is_shintai,
    },
    {
      title: WITH_TSUIN,
      formTitle: 'is_with_tsuin',
      formValue: 'with_tsuin_amount',
      form: form.values.is_with_tsuin,
    },
    {
      title: TSUIN,
      formTitle: 'is_tsuin',
      formValue: 'tsuin_amount',
      form: form.values.is_tsuin,
    },
  ];
};
