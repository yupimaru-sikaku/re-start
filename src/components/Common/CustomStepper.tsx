import { useState } from 'react';
import { Stepper } from '@mantine/core';
import { NextPage } from 'next';

type Props = {
  statusStep?: number;
};

export const CustomStepper: NextPage<Props> = ({ statusStep = 0 }) => {
  const [active, setActive] = useState(statusStep);

  return (
    <>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="記録票作成"
          description="記録票の作成・編集"
        ></Stepper.Step>
        <Stepper.Step
          label="リスタート確認中"
          description="請求前の確認"
        ></Stepper.Step>
        <Stepper.Step label="請求中" description="請求結果待ち"></Stepper.Step>
        <Stepper.Step label="請求済" description=""></Stepper.Step>
      </Stepper>
    </>
  );
};
