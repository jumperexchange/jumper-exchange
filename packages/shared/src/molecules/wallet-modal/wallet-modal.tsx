import { Wallet } from '@lifi/wallet-management';
import EastIcon from '@mui/icons-material/East';
import { Box, IconButton, Typography } from '@mui/material';
import { useSettings } from '@transferto/shared/src/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { WalletCard } from '../../atoms/wallet-card';

import {
  WalletCardsContainer,
  WalletDialog,
  WalletDialogBackground,
  WalletDialogWrapper,
  WalletSlide,
} from './wallet-modal.styles';

type WalletModalProps = {
  open: boolean;
  wallets: Wallet[];
  handleClose: Function;
  setOpen: Function;
  walletManagement: any;
};

export const WalletModal = ({
  open,
  wallets,
  setOpen,
  handleClose,
  walletManagement,
}: WalletModalProps) => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] =
    useState<Wallet>();
  // const { connect, signer } = useLiFiWalletManagement()
  const { ethereum } = window as any;
  const settings = useSettings();

  const { connect } = walletManagement;

  const login = async (wallet: Wallet) => {
    if (wallet.checkProviderIdentity) {
      const checkResult = wallet.checkProviderIdentity(ethereum);
      if (!checkResult) {
        setShowWalletIdentityPopover(wallet);
        return;
      }
    }
    await connect(wallet);
    settings.onWalletConnect(wallet.name);
    try {
    } catch (e) {}

    handleClose();
  };

  useEffect(() => {
    setShowWalletIdentityPopover(undefined);
  }, [open]);

  const containerRef = useRef(null);

  const handleChange = () => {
    setOpen((open) => !open);
  };

  return (
    open && (
      <WalletSlide
        ref={containerRef}
        className="slide"
        direction="left"
        in={open}
        container={containerRef.current}
      >
        <WalletDialogWrapper>
          <WalletDialogBackground
            onClick={() => {
              handleClose();
            }}
          />
          <WalletDialog maxWidth={'tablet'} open={open}>
            <Box
              p={4}
              display="flex"
              justifyContent="space-between"
              alignItems={'center'}
            >
              <Typography variant="h5" align="center">
                Choose a Wallet
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => {
                  handleClose();
                }}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                  '&:hover': {
                    background: 'transparent',
                  },
                }}
              >
                <EastIcon />
              </IconButton>
            </Box>
            <WalletCardsContainer>
              {wallets.map((wallet) => {
                return (
                  <WalletCard
                    onClick={() => login(wallet)}
                    key={wallet.name}
                    src={wallet.icon}
                    title={wallet.name}
                  />
                );
              })}
            </WalletCardsContainer>
          </WalletDialog>
        </WalletDialogWrapper>
      </WalletSlide>
    )
  );
};
