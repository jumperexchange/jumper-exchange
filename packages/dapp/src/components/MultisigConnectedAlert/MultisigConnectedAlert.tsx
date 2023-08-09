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
  const { t: translate } = useTranslation();

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
          {translate('multisig.connected.title', 'translation')}
        </Typography>
        <Typography fontSize={'1.125 rem'} marginY={4}>
          {translate('multisig.connected.description', 'translation')}
        </Typography>
        <ButtonPrimary
          onClick={onClose}
          style={{
            width: '100%',
          }}
        >
          {translate('button.okay', 'translation')}
        </ButtonPrimary>
      </MultisigConnectedAlertContainer>
    </Modal>
  );
};
