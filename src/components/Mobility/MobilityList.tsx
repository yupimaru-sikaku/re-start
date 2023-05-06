import {
  useDeleteMobilityMutation,
  useGetMobilityListByCorporateIdQuery,
  useGetMobilityListByLoginIdQuery,
  useGetMobilityListQuery,
} from '@/ducks/mobility/query';
import { RootState } from '@/ducks/root-reducer';
import { useSelector } from '@/ducks/store';
import { useGetTablePage } from '@/hooks/useGetTablePage';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useMemo, useState } from 'react';
import { MobilityListRecords } from './MobilityListRecords';
import { CustomConfirm } from '../Common/CustomConfirm';
import { ReturnMobility } from '@/ducks/mobility/slice';
import { CreatePdf } from './CreatePdf';

export const MobilityList = () => {
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const [page, setPage] = useState(1);
  const data1 = useGetMobilityListQuery();
  const data2 = useGetMobilityListByCorporateIdQuery(
    loginProviderInfo.corporate_id
  );
  const data3 = useGetMobilityListByLoginIdQuery(
    loginProviderInfo.id
  );
  const [deleteMobility] = useDeleteMobilityMutation();
  const {
    data: mobilityList,
    isLoading: mobilityListLoading,
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
  const { PAGE_SIZE, records } = useGetTablePage(page, mobilityList);
  const handlePDFDownload = async (Mobility: ReturnMobility) => {
    // const pdfBytes = await CreatePdf(
    //   '/home_care_records.pdf',
    //   Mobility
    // );
    // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = `${Mobility.name}.pdf`;
    // link.click();
  };
  useEffect(() => {
    refetch();
  }, []);
  const handleDelete = async (id: string) => {
    const isOK = await CustomConfirm(
      '削除します。よろしいですか？',
      '確認画面'
    );
    isOK && (await deleteMobility(id));
    refetch();
  };
  return (
    <DataTable
      fetching={mobilityListLoading}
      striped
      highlightOnHover
      withBorder
      records={records || []}
      recordsPerPage={PAGE_SIZE}
      totalRecords={mobilityList?.length || 0}
      page={page}
      onPageChange={(p) => setPage(p)}
      columns={MobilityListRecords({
        handleDelete,
        handlePDFDownload,
      })}
    />
  );
};
