import type { Theme } from '@mui/material';
import { Modal, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import {
  MultisigConfirmationModalContainer,
  MultisigConfirmationModalIcon,
  MultisigConfirmationModalIconContainer,
} from 'src/components/MultisigConfirmationModal';
import { useMetaMask } from 'src/hooks/useMetaMask';
import { InfoAlert } from '../InfoAlert';

export const WalletAlert = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isMetaMaskConnector } = useMetaMask();

  const title = 'Metamask update is required';
  const subtitle =
    'Please update MetaMask to the latest version. This update solves a bug present in older versions.';
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  useEffect(() => {
    if (isMetaMaskConnector) {
      setIsOpen(true);
    }
  }, [isMetaMaskConnector]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isMobile ? (
        <Modal open={isOpen} onClose={onClose}>
          <MultisigConfirmationModalContainer>
            <MultisigConfirmationModalIconContainer>
              <MultisigConfirmationModalIcon />
            </MultisigConfirmationModalIconContainer>
            {
              //* todo: test format of typography *//
            }
            <Typography
              variant="bodyLargeStrong"
              fontSize={'1.125rem'}
              fontWeight={700}
              textAlign={'center'}
              marginY={4}
            >
              {title}
            </Typography>
            {
              //* todo: test format of typography *//
            }
            <Typography variant="bodyLarge" fontSize={'1.125 rem'} marginY={4}>
              {subtitle}
            </Typography>
            <Button
              variant="primary"
              muiVariant="contained"
              styles={{
                width: '100%',
              }}
              onClick={onClose}
            >
              {'I confirm'}
            </Button>
          </MultisigConfirmationModalContainer>
        </Modal>
      ) : (
        <InfoAlert active={true} title={title} subtitle={subtitle} />
      )}
    </>
  );
};
