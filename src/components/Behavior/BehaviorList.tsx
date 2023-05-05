import {
  useDeleteBehaviorMutation,
  useGetBehaviorListByCorporateIdQuery,
  useGetBehaviorListByLoginIdQuery,
  useGetBehaviorListQuery,
} from '@/ducks/behavior/query';
import { RootState } from '@/ducks/root-reducer';
import { useSelector } from '@/ducks/store';
import { useGetTablePage } from '@/hooks/useGetTablePage';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useMemo, useState } from 'react';
import { BehaviorListRecords } from './BehaviorListRecords';
import { CustomConfirm } from '../Common/CustomConfirm';
import { ReturnBehavior } from '@/ducks/behavior/slice';
import { CreatePdf } from './CreatePdf';

export const BehaviorList = () => {
  const loginProviderInfo = useSelector(
    (state: RootState) => state.provider.loginProviderInfo
  );
  const [page, setPage] = useState(1);
  const data1 = useGetBehaviorListQuery();
  const data2 = useGetBehaviorListByCorporateIdQuery(
    loginProviderInfo.corporate_id
  );
  const data3 = useGetBehaviorListByLoginIdQuery(
    loginProviderInfo.id
  );
  const [deleteBehavior] = useDeleteBehaviorMutation();
  const {
    data: behaviorList,
    isLoading: behaviorListLoading,
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
  const { PAGE_SIZE, records } = useGetTablePage(page, behaviorList);
  const handlePDFDownload = async (Behavior: ReturnBehavior) => {
    // const pdfBytes = await CreatePdf(
    //   '/home_care_records.pdf',
    //   Behavior
    // );
    // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = `${Behavior.name}.pdf`;
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
    isOK && (await deleteBehavior(id));
    refetch();
  };
  return (
    <DataTable
      fetching={behaviorListLoading}
      striped
      highlightOnHover
      withBorder
      records={records || []}
      recordsPerPage={PAGE_SIZE}
      totalRecords={behaviorList?.length || 0}
      page={page}
      onPageChange={(p) => setPage(p)}
      columns={BehaviorListRecords({
        handleDelete,
        handlePDFDownload,
      })}
    />
  );
};
