import { Modal, Typography } from '@mui/material';

import { ButtonPrimary } from '@transferto/shared/src';
import { useTranslation } from 'react-i18next';
import {
  MultisigConfirmationModalContainer,
  MultisigConfirmationModalIcon,
  MultisigConfirmationModalIconContainer,
} from './MultisigConfirmationModal.style';

export const MultisigConfirmationModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { t: translate } = useTranslation();

  return (
    <Modal open={open} onClose={onClose}>
      <MultisigConfirmationModalContainer>
        <MultisigConfirmationModalIconContainer>
          <MultisigConfirmationModalIcon />
        </MultisigConfirmationModalIconContainer>
        <Typography
          fontWeight={700}
          textAlign={'center'}
          marginY={4}
          style={{
            fontSize: '1.125rem',
          }}
        >
          {translate('multisig.transactionInitiated.title', 'translation')}
        </Typography>
        <Typography fontSize={'1.125 rem'} marginY={4}>
          {translate(
            'multisig.transactionInitiated.description',
            'translation',
          )}
        </Typography>
        <ButtonPrimary
          style={{
            width: '100%',
          }}
          variant="contained"
          onClick={onClose}
        >
          {translate('button.okay', 'translation')}
        </ButtonPrimary>
      </MultisigConfirmationModalContainer>
    </Modal>
  );
};
