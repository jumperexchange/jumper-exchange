import { Modal, Typography } from '@mui/material';
import { ButtonPrimary } from '@transferto/shared/src';
import { useTranslation } from 'react-i18next';
import {
  MultisigConnectedAlertContainer,
  MultisigConnectedAlertIcon,
  MultisigConnectedAlertIconContainer,
} from './MultisigConnectedAlert.style';

export const MultisigConnectedAlert: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose}>
      <MultisigConnectedAlertContainer>
        <MultisigConnectedAlertIconContainer>
          <MultisigConnectedAlertIcon />
        </MultisigConnectedAlertIconContainer>
        <Typography
          fontWeight={700}
          textAlign={'center'}
          marginY={4}
          style={{
            fontSize: '1.125rem',
          }}
        >
          {t('multisig.connected.title')}
        </Typography>
        <Typography fontSize={'1.125 rem'} marginY={4}>
          {t('multisig.connected.description')}
        </Typography>
        <ButtonPrimary
          onClick={onClose}
          style={{
            width: '100%',
          }}
        >
          {t('button.okay')}
        </ButtonPrimary>
      </MultisigConnectedAlertContainer>
    </Modal>
  );
};
