import { useCallback, useEffect, useState } from 'react';

export const useFullScreenDrawer = (
  initialOpen = false,
  onOpen?: () => void,
  onClose?: () => void,
) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    setIsOpen(initialOpen);
  }, [initialOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  return { isOpen, open, close };
};
