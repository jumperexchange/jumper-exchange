import { Modal, Typography } from '@mui/material';

import { Button } from '@/components/Button';
import { useTranslation } from 'react-i18next';
import {
  MultisigConfirmationModalContainer,
  MultisigConfirmationModalIcon,
  MultisigConfirmationModalIconContainer,
} from '.';

export const MultisigConfirmationModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { t } = useTranslation();

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
          sx={{
            color: 'inherit',
            fontSize: '1.125rem',
          }}
        >
          {t('multisig.transactionInitiated.title')}
        </Typography>
        <Typography
          fontSize={'1.125 rem'}
          marginY={4}
          sx={{
            color: 'inherit',
          }}
        >
          {t('multisig.transactionInitiated.description')}
        </Typography>
        <Button
          aria-label={t('multisig.transactionInitiated.description')}
          variant="primary"
          muiVariant="contained"
          styles={{
            width: '100%',
          }}
          onClick={onClose}
        >
          {t('button.okay')}
        </Button>
      </MultisigConfirmationModalContainer>
    </Modal>
  );
};
