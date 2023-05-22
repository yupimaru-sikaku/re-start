import { Stepper } from '@mantine/core';
import { NextPage } from 'next';

type Props = {
  statusId?: number;
};

export const CustomStepper: NextPage<Props> = ({ statusId = 0 }) => {
  const status = statusId === 3 ? statusId + 1 : statusId;
  return (
    <>
      <Stepper active={status} breakpoint="sm">
        <Stepper.Step label="記録票作成" description="記録票の作成・編集"></Stepper.Step>
        <Stepper.Step label="リスタート確認中" description="請求前の確認"></Stepper.Step>
        <Stepper.Step label="請求中" description="請求結果待ち"></Stepper.Step>
        <Stepper.Step label="申請完了" description=""></Stepper.Step>
      </Stepper>
    </>
  );
};
