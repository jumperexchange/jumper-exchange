'use client';

import { Modal, Typography } from '@mui/material';
import { peerExtensionSdk } from '@zkp2p/sdk';
import { Button } from '@/components/Button';
import { usePeerExtensionInstallStore } from '@/stores/peerExtensionInstall/PeerExtensionInstallStore';
import {
  PeerExtensionInstallModalContainer,
  PeerExtensionInstallModalIcon,
  PeerExtensionInstallModalIconContainer,
} from './PeerExtensionInstallModal.style';

const content = {
  needs_install: {
    title: 'Peer Extension Required',
    description:
      'To complete this transaction, the Peer extension must be installed in your browser.',
    buttonLabel: 'Install Extension',
  },
  needs_connection: {
    title: 'Connecting Peer Extension',
    description:
      'The Peer extension will connect to your wallet and complete the on-ramp for you.',
    buttonLabel: 'Got it',
  },
  onramp: {
    title: 'Complete Your Payment',
    description:
      'Continue in the side window that just opened. Create an account on Peer and submit your payment to complete the transaction.',
    buttonLabel: 'Got it',
  },
};

export const PeerExtensionInstallModal: React.FC = () => {
  const { isModalOpen, type, closeModal } = usePeerExtensionInstallStore();

  const handleAction = () => {
    if (type === 'needs_install') {
      peerExtensionSdk.openInstallPage();
    }
    closeModal();
  };

  const { title, description, buttonLabel } = content[type ?? 'needs_install'];

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <PeerExtensionInstallModalContainer>
        <PeerExtensionInstallModalIconContainer>
          <PeerExtensionInstallModalIcon />
        </PeerExtensionInstallModalIconContainer>
        <Typography
          fontWeight={700}
          textAlign="center"
          sx={{ color: 'inherit', fontSize: '1.125rem', marginBottom: 1 }}
        >
          {title}
        </Typography>
        <Typography
          textAlign="center"
          sx={{
            color: 'inherit',
            fontSize: '0.875rem',
            opacity: 0.7,
            marginBottom: 3,
          }}
        >
          {description}
        </Typography>
        <Button
          variant="primary"
          muiVariant="contained"
          styles={{ width: '100%' }}
          onClick={handleAction}
        >
          {buttonLabel}
        </Button>
      </PeerExtensionInstallModalContainer>
    </Modal>
  );
};
