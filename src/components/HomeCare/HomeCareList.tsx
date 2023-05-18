import React, { useMemo, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { CreatePdf } from './CreatePdf';
import { CustomConfirm } from '../Common/CustomConfirm';
import {
  useDeleteHomeCareMutation,
  useGetHomeCareListByCoroprateIdQuery,
  useGetHomeCareListByLoginIdQuery,
  useGetHomeCareListQuery,
} from '@/ducks/home-care/query';
import { HomeCareListRecords } from './HomeCareListRecords';
import { useGetTablePage } from '@/hooks/table/useGetTablePage';
import { ReturnHomeCare } from '@/ducks/home-care/slice';
import { useSelector } from '@/ducks/store';
import { RootState } from '@/ducks/root-reducer';

export const HomeCareList = () => {
  const [page, setPage] = useState(1);
  const loginProviderInfo = useSelector((state: RootState) => state.provider.loginProviderInfo);
  const data1 = useGetHomeCareListQuery();
  const data2 = useGetHomeCareListByCoroprateIdQuery(loginProviderInfo.id);
  const data3 = useGetHomeCareListByLoginIdQuery(loginProviderInfo.id || '');
  const {
    data: HomeCareList,
    isLoading: HomeCareListLoading,
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
  const [deleteHomeCare] = useDeleteHomeCareMutation();

  const handleDelete = async (id: string) => {
    const isOK = await CustomConfirm('削除します。よろしいですか？', '確認画面');
    isOK && (await deleteHomeCare(id));
    refetch();
  };

  const handlePDFDownload = async (homeCare: ReturnHomeCare) => {
    const pdfBytes = await CreatePdf('/home_care_records.pdf', homeCare);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${homeCare.user_name}.pdf`;
    link.click();
  };

  return (
    <></>
    // <DataTable
    //   fetching={HomeCareListLoading}
    //   striped
    //   highlightOnHover
    //   withBorder
    //   records={records || []}
    //   recordsPerPage={PAGE_SIZE}
    //   totalRecords={HomeCareList?.length || 0}
    //   page={page}
    //   onPageChange={(p) => setPage(p)}
    //   columns={HomeCareListRecords({
    //     handleDelete,
    //     handlePDFDownload,
    //   })}
    // />
  );
};
