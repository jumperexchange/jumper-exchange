import { FC, PropsWithChildren } from 'react';

import { motion } from 'motion/react';

import Modal from '@mui/material/Modal';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';

import { CenteredWrapper, CloseIconButton } from './ModalContainer.styles';

export interface ModalContainerProps extends PropsWithChildren {
  onClose: () => void;
  isOpen: boolean;
}

const motionConfig = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    visualDuration: 0.5,
    delay: 0.1,
  },
  style: {
    position: 'absolute',
    top: '0',
    right: '0',
    x: '100%',
    y: '-100%',
  },
} as const;

export const ModalContainer: FC<ModalContainerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <Modal open={isOpen} onClose={onClose}>
      <CenteredWrapper>
        {!isMobile && (
          <motion.div {...motionConfig}>
            <CloseIconButton onClick={onClose}>
              <CloseIcon
                sx={{
                  width: '24px',
                  height: '24px',
                }}
              />
            </CloseIconButton>
          </motion.div>
        )}
        {children}
      </CenteredWrapper>
    </Modal>
  );
};
