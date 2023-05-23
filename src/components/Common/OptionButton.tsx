import React from 'react';
import { CustomButton } from './CustomButton';
import { Group } from '@mantine/core';
import { ReturnAccompany } from '@/ducks/accompany/slice';
import { ReturnMobility } from '@/ducks/mobility/slice';
import { ReturnBehavior } from '@/ducks/behavior/slice';
import { useHasPermit } from '@/hooks/form/useHasPermit';

type Props = {
  service: ReturnAccompany | ReturnBehavior | ReturnMobility;
  handleChangeStatus: (service: any, statusId: number) => void;
};

export const OptionButton = ({ service, handleChangeStatus }: Props) => {
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
      <CustomButton color="cyan" disabled={!hasPermit(service.status, 'download')} variant="light">
        ダウンロード
      </CustomButton>
    </Group>
  );
};
