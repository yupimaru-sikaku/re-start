import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Text, Modal, Paper, Group, Space } from '@mantine/core';

type Props = {
  title?: string;
  message: string;
  resolve: (result: boolean | PromiseLike<boolean>) => void;
  cleanup: () => void;
};

const AlertDialog: React.FC<Props> = ({
  title = '',
  message = '',
  resolve,
  cleanup,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => cleanup);

  const handleCancel = () => {
    setOpen(false);
    resolve(false);
  };

  const handleOk = () => {
    setOpen(false);
    resolve(true);
  };

  return (
    <Modal
      opened={open}
      onClose={handleCancel}
      title={title}
      withCloseButton={false}
    >
      <Text align="center">{message}</Text>
      <Space h="lg" />
      <Group position="right" spacing="xs">
        <Button variant="subtle" color="gray" onClick={handleCancel}>
          キャンセル
        </Button>
        <Button onClick={handleOk}>OK</Button>
      </Group>
    </Modal>
  );
};

export const CustomConfirm = (
  message: string,
  title = ''
): Promise<boolean> => {
  const wrapper = document.body.appendChild(document.createElement('div'));
  const root = createRoot(wrapper);
  const cleanup = () => {
    setTimeout(() => {
      root.unmount();
      wrapper.remove();
    }, 0);
  };
  return new Promise<boolean>((resolve, reject) => {
    try {
      root.render(
        <AlertDialog
          title={title}
          message={message}
          resolve={resolve}
          cleanup={cleanup}
        />
      );
    } catch (err) {
      cleanup();
      reject(err);
    }
  });
};
