import React, { useMemo, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { CreatePdf } from './CreatePdf';
import { CustomConfirm } from '../Common/CustomConfirm';
import {
  useDeleteHomeCareSupportMutation,
  useGetHomeCareSupportListByCoroprateIdQuery,
  useGetHomeCareSupportListByLoginIdQuery,
  useGetHomeCareSupportListQuery,
} from '@/ducks/home-care-support/query';
import { HomeCareListRecords } from './HomeCareListRecords';
import { useGetTablePage } from '@/hooks/useGetTablePage';
import { ReturnHomeCareSupport } from '@/ducks/home-care-support/slice';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';

export const HomeCareSupportList = () => {
  const [page, setPage] = useState(1);
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const data1 = useGetHomeCareSupportListQuery();
  const data2 = useGetHomeCareSupportListByCoroprateIdQuery(
    loginProviderInfo.id
  );
  const data3 = useGetHomeCareSupportListByLoginIdQuery(
    loginProviderInfo.id || ''
  );
  const {
    data: homeCareSupportList,
    isLoading: homeCareSupportListLoading,
    refetch,
  } = useMemo(() => {
    if (loginProviderInfo.role === 'admin') {
      return data1;
    } else if (loginProviderInfo.role === 'corporate') {
      return data2;
    } else {
      return data3;
    }
  }, [data1, data2, data3]);
  const [deleteHomeCareSupport] = useDeleteHomeCareSupportMutation();
  const { records, PAGE_SIZE } = useGetTablePage(page, homeCareSupportList);

  const handleDelete = async (id: string) => {
    const isOK = await CustomConfirm(
      '削除します。よろしいですか？',
      '確認画面'
    );
    isOK && (await deleteHomeCareSupport(id));
    refetch();
  };

  const handlePDFDownload = async (homeCare: ReturnHomeCareSupport) => {
    const pdfBytes = await CreatePdf('/home_care_records.pdf', homeCare);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${homeCare.name}.pdf`;
    link.click();
  };

  return (
    <DataTable
      fetching={homeCareSupportListLoading}
      striped
      highlightOnHover
      withBorder
      records={records || []}
      recordsPerPage={PAGE_SIZE}
      totalRecords={homeCareSupportList?.length || 0}
      page={page}
      onPageChange={(p) => setPage(p)}
      columns={HomeCareListRecords({
        handleDelete,
        handlePDFDownload,
      })}
    />
  );
};
