import { Button } from '@/components/Button';
import { Modal, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  MultisigConnectedAlertContainer,
  MultisigConnectedAlertIcon,
  MultisigConnectedAlertIconContainer,
} from '.';

export const MultisigConnectedAlert: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose}>
      <MultisigConnectedAlertContainer className="alert">
        <MultisigConnectedAlertIconContainer>
          <MultisigConnectedAlertIcon />
        </MultisigConnectedAlertIconContainer>
        <Typography
          sx={(theme) => ({
            color: 'inherit',
            fontWeight: 700,
            marginY: theme.spacing(0.5),
            textAlign: 'center',
            fontSize: '1.125rem',
          })}
        >
          {t('multisig.connected.title')}
        </Typography>
        <Typography
          sx={(theme) => ({
            fontSize: '1.125 rem',
            marginY: theme.spacing(0.5),
            color: 'inherit',
          })}
        >
          {t('multisig.connected.description')}
        </Typography>
        <Button
          aria-label="Close"
          variant="primary"
          onClick={onClose}
          styles={{
            width: '100%',
          }}
        >
          {t('button.okay')}
        </Button>
      </MultisigConnectedAlertContainer>
    </Modal>
  );
};
