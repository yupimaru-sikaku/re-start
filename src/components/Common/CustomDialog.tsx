import { Modal, Grid } from '@mantine/core';
import { NextPage } from 'next';
import { CustomButton } from './CustomButton';

type Props = {
  opened: boolean;
  close: () => void;
  title: string;
  isCancel?: boolean;
};

export const customDialog = ({ opened, close, title, isCancel = false }) => {
  const handleOK = () => {
    return true;
  };
  const handleCancel = () => {
    return false;
  };

  return (
    <Modal
      opened
      onClose={close}
      title={title}
      centered
      withCloseButton={false}
    >
      <Grid justify="flex-end">
        {isCancel && (
          <CustomButton variant="subtle" color="gray" onClick={handleCancel}>
            キャンセル
          </CustomButton>
        )}
        <CustomButton onClick={handleOK}>OK</CustomButton>
      </Grid>
    </Modal>
  );
};
