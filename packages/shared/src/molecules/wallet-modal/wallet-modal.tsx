import { Wallet } from '@lifi/wallet-management';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { WalletCard } from '../../atoms/wallet-card';
import { WalletCardGrid, WalletDialog } from './wallet-modal.styles';

type WalletModalProps = {
  open: boolean;
  wallets: Wallet[];
  handleClose: Function;
  walletManagement: any;
};

export const WalletModal = ({
  open,
  wallets,
  handleClose,
  walletManagement,
}: WalletModalProps) => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] =
    useState<Wallet>();
  // const { connect, signer } = useLiFiWalletManagement()
  const { ethereum } = window as any;

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
    try {
    } catch (e) {}

    handleClose();
  };

  useEffect(() => {
    setShowWalletIdentityPopover(undefined);
  }, [open]);

  return (
    <WalletDialog maxWidth={'tablet'} open={open} onClose={() => {}}>
      <IconButton
        aria-label="close"
        onClick={() => {
          handleClose();
        }}
        sx={{
          position: 'absolute',
          right: 16,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          '&:hover': {
            background: 'transparent',
          },
        }}
      >
        X
      </IconButton>
      <Box p={4} justifyContent="center" alignItems={'center'}>
        <Typography variant="h5" align="center">
          Choose a Wallet
        </Typography>
      </Box>
      <WalletCardGrid
        alignItems="center"
        justifyContent="center"
        alignSelf={'center'}
        container
        spacing={4}
      >
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
      </WalletCardGrid>
    </WalletDialog>
  );
};
