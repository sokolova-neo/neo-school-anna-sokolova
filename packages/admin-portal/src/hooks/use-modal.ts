import { useState } from 'react';

interface UseModalValues {
  isOpen: boolean;
  handleOpen: VoidFunction;
  handleClose: VoidFunction;
}

const useModal = (initialIsOpen = false): UseModalValues => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const handleOpen = (): void => setIsOpen(true);
  const handleClose = (): void => setIsOpen(false);

  return {
    isOpen,
    handleOpen,
    handleClose,
  };
};

export { useModal };
