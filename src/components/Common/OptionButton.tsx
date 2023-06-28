import React from 'react';
import { CustomButton } from './CustomButton';
import { Group } from '@mantine/core';
import { useHasPermit } from '@/hooks/form/useHasPermit';
import { RecordServiceType } from '@/ducks/common-service/slice';
import { unparse } from 'papaparse';

type Props = {
  service: RecordServiceType;
  handleChangeStatus: (service: any, statusId: number) => void;
  handlePDFDownload: (service: RecordServiceType) => Promise<void>;
};

export const OptionButton = ({ service, handleChangeStatus, handlePDFDownload }: Props) => {
  const { hasPermit } = useHasPermit();

  const handleTranslateCsv = (service: any) => {
    const csvData = unparse([service]); // Wrap the service object in an array

    // Create a blob from the CSV data
    var blob = new Blob([csvData], { type: 'text/csv' });

    // Create a link and trigger a click to download the CSV file
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.csv';
    a.click();
  };

  return (
    <Group>
      <CustomButton
        color="cyan"
        variant="light"
        disabled={!hasPermit(service.status, 'submit')}
        onClick={() => handleChangeStatus(service, 1)}
      >
        提出
      </CustomButton>
      <CustomButton
        color="cyan"
        variant="light"
        disabled={!hasPermit(service.status, 'apply')}
        onClick={() => handleChangeStatus(service, 2)}
      >
        申請
      </CustomButton>
      <CustomButton
        color="pink"
        variant="light"
        disabled={!hasPermit(service.status, 'reject')}
        onClick={() => handleChangeStatus(service, 0)}
      >
        差戻し
      </CustomButton>
      <CustomButton
        color="cyan"
        variant="light"
        disabled={!hasPermit(service.status, 'done')}
        onClick={() => handleChangeStatus(service, 3)}
      >
        完了
      </CustomButton>
      <CustomButton
        color="cyan"
        disabled={!hasPermit(service.status, 'download')}
        variant="light"
        onClick={() => handlePDFDownload(service)}
      >
        ダウンロード
      </CustomButton>
      <CustomButton
        color="cyan"
        variant="light"
        disabled={!hasPermit(service.status, 'done')}
        onClick={() => handleTranslateCsv(service)}
      >
        CSV
      </CustomButton>
    </Group>
  );
};
