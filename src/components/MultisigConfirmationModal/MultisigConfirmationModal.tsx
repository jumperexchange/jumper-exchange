import { Modal, Typography } from '@mui/material';

import { useTranslations } from 'next-intl';
import { Button } from 'src/components';
import {
  MultisigConfirmationModalContainer,
  MultisigConfirmationModalIcon,
  MultisigConfirmationModalIconContainer,
} from '.';

export const MultisigConfirmationModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const t = useTranslations();

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
          {t('multisig.transactionInitiated.title')}
        </Typography>
        <Typography fontSize={'1.125 rem'} marginY={4}>
          {t('multisig.transactionInitiated.description')}
        </Typography>
        <Button
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
