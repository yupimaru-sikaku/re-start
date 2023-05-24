import React from 'react';
import { CustomButton } from './CustomButton';
import { Group } from '@mantine/core';
import { useHasPermit } from '@/hooks/form/useHasPermit';
import { ServiceType } from '@/ducks/common-service/slice';

type Props = {
  service: ServiceType;
  handleChangeStatus: (service: any, statusId: number) => void;
  handlePDFDownload: (service: ServiceType) => Promise<void>;
};

export const OptionButton = ({ service, handleChangeStatus, handlePDFDownload }: Props) => {
  const { hasPermit } = useHasPermit();

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
    </Group>
  );
};
