import React from 'react';
import { CustomButton } from './CustomButton';
import { Group } from '@mantine/core';
import { ReturnAccompany } from '@/ducks/accompany/slice';
import { ReturnMobility } from '@/ducks/mobility/slice';
import { ReturnBehavior } from '@/ducks/behavior/slice';
import { useSelector } from '@/ducks/store';

type Props = {
  service: ReturnAccompany | ReturnBehavior | ReturnMobility;
  handleChangeStatus: (service: any, statusId: number) => void;
};

export const OptionButton = ({ service, handleChangeStatus }: Props) => {
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);

  const hasPermit = (type: string) => {
    switch (type) {
      case 'submit':
        return service.status === 0 && (loginProviderInfo.role === 'admin' || loginProviderInfo.role === 'corporate');
      case 'apply':
        return service.status === 1 && loginProviderInfo.role === 'admin';
      case 'reject':
      case 'done':
        return service.status === 2 && loginProviderInfo.role === 'admin';
      case 'download':
        return service.status !== 0;
      default:
        return true;
    }
  };

  return (
    <Group>
      <CustomButton color="cyan" variant="light" disabled={!hasPermit('submit')} onClick={() => handleChangeStatus(service, 1)}>
        提出
      </CustomButton>
      <CustomButton color="cyan" variant="light" disabled={!hasPermit('apply')} onClick={() => handleChangeStatus(service, 2)}>
        申請
      </CustomButton>
      <CustomButton color="pink" variant="light" disabled={!hasPermit('reject')} onClick={() => handleChangeStatus(service, 0)}>
        差戻し
      </CustomButton>
      <CustomButton color="cyan" variant="light" disabled={!hasPermit('done')} onClick={() => handleChangeStatus(service, 3)}>
        完了
      </CustomButton>
      <CustomButton color="cyan" disabled={!hasPermit('download')} variant="light">
        ダウンロード
      </CustomButton>
    </Group>
  );
};
