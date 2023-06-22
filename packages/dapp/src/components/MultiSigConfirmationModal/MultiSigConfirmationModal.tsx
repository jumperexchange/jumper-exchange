import React from 'react';
import { Modal, Typography } from '@mui/material';
import {
  MultiSigConfirmationModalContainer,
  MultiSigConfirmationModalContent,
} from './MultiSigConfirmationModal.styles';

const MultiSigConfirmationModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <MultiSigConfirmationModalContainer>
        <MultiSigConfirmationModalContent>
          <div>Request sent</div>

          <Typography>
            Please inform all the signers to confirm the transaction within the
            next 2 mins to avoid any fluctuations in route prices.
          </Typography>
        </MultiSigConfirmationModalContent>
      </MultiSigConfirmationModalContainer>
    </Modal>
  );
};

export default MultiSigConfirmationModal;
