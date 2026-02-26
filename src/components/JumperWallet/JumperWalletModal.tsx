'use client';

import { Box, Modal } from '@mui/material';
import { useJumperWalletStore } from '@/stores/jumperWallet/JumperWalletStore';
import { LoginModal } from './Login/LoginModal';
import { PasswordPrompt } from './Login/PasswordPrompt';
import { RecoveryWizard } from './Recovery/RecoveryWizard';
import { SignUpWizard } from './SignUp/SignUpWizard';
import { useMemo } from 'react';

/**
 * Main orchestrator modal for the Jumper Internal Wallet.
 * Renders the appropriate flow based on the store's `flow` state.
 *
 * This component should be rendered once at the app level (inside WalletProvider).
 * It reacts to flow changes triggered by the wagmi connector or user actions.
 */
export function JumperWalletModal() {
  const { flow, setFlow, resolveConnectRequest, resolvePasswordRequest } =
    useJumperWalletStore((s) => ({
      flow: s.flow,
      setFlow: s.setFlow,
      resolveConnectRequest: s.resolveConnectRequest,
      resolvePasswordRequest: s.resolvePasswordRequest,
    }));

  const isOpen = flow !== 'idle';

  const handleClose = (_event: object, _reason: string) => {
    resolveConnectRequest(null);
    resolvePasswordRequest(null);
    setFlow('idle');
  };

  const content = useMemo(() => {
    switch (flow) {
      case 'signup':
        return <SignUpWizard />;
      case 'login':
        return <LoginModal />;
      case 'password-prompt':
        return <PasswordPrompt />;
      case 'recovery':
        return <RecoveryWizard />;
      default:
        return null;
    }
  }, [flow]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={(theme) => ({
          backgroundColor: (theme.vars || theme).palette.surface1.main,
          borderRadius: '12px',
          boxShadow: theme.shadows[12],
          maxHeight: '90vh',
          overflow: 'auto',
          outline: 'none',
        })}
      >
        {content}
      </Box>
    </Modal>
  );
}
