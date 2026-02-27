'use client';

import { Alert, CircularProgress, Box } from '@mui/material';
import {
  ButtonPrimary,
  ButtonTransparent,
} from '@/components/Button/Button.style';
import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import { useWalletRecovery } from '@/internal-wallet/hooks/useWalletRecovery';
import { RecoveryContainer, RecoveryTitle } from './RecoveryWizard.style';
import type {
  ShamirShare,
  ShareStorageType,
} from '@/internal-wallet/crypto/types';
import { JUMPER_WALLET_ADDRESS_KEY } from '@/config/jumperWallet';
import { listStoredAddresses } from '@/internal-wallet/recovery/adapters/localStorageAdapter';
import {
  RecoveryCollectionStep,
  parseRawShare,
  type RecoveryCollectionEntry,
  type ShareCollectionStatus,
} from './RecoveryCollectionStep';
import { RecoverySetPasswordStep } from './RecoverySetPasswordStep';
import { WalletSelectionStep } from './WalletSelectionStep';

const ALL_ADAPTERS: ShareStorageType[] = [
  'localStorage',
  'googleDrive',
  'email',
  'recoveryCode',
];

export function RecoveryWizard() {
  const { t } = useTranslation();
  const recovery = useWalletRecovery();

  // Wallet address stored on-device (may be empty after a full data wipe).
  const storedAddress =
    typeof window !== 'undefined'
      ? (localStorage.getItem(JUMPER_WALLET_ADDRESS_KEY) ?? '')
      : '';

  // All addresses that have a local recovery share on this device.
  const discoveredAddresses =
    typeof window !== 'undefined' ? listStoredAddresses() : [];

  // User-selected address (overrides storedAddress when there are multiple).
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  // True when the user explicitly chose to recover without selecting a device address.
  const [skipAddressSelection, setSkipAddressSelection] = useState(false);

  // The address we'll actually use for share retrieval.
  // Priority: user selection → stored key → single discovered address.
  const effectiveAddress =
    selectedAddress ||
    storedAddress ||
    (discoveredAddresses.length === 1 ? discoveredAddresses[0] : '');

  // Show address selection when there are multiple discovered addresses
  // and the user hasn't yet picked one or chosen to skip.
  const needsAddressSelection =
    !selectedAddress && !skipAddressSelection && discoveredAddresses.length > 1;

  const [collectionEntries, setCollectionEntries] = useState<
    RecoveryCollectionEntry[]
  >(ALL_ADAPTERS.map((type) => ({ type, status: 'idle' })));

  const handleCollectionStatusChange = useCallback(
    (
      type: ShareStorageType,
      status: ShareCollectionStatus,
      share?: ShamirShare,
      error?: string,
    ) => {
      setCollectionEntries((prev) =>
        prev.map((e) => (e.type === type ? { ...e, status, error } : e)),
      );
      if (share) {
        recovery.addCollectedShare(share);
      }
    },
    [recovery],
  );

  const handleManualInput = useCallback(
    (type: ShareStorageType, value: string) => {
      setCollectionEntries((prev) =>
        prev.map((e) => (e.type === type ? { ...e, manualValue: value } : e)),
      );
    },
    [],
  );

  // --- Steps ---

  const renderSelectWallet = () => (
    <WalletSelectionStep
      addresses={discoveredAddresses}
      onSelect={setSelectedAddress}
      onRecoverWithoutAddress={() => setSkipAddressSelection(true)}
    />
  );

  const renderCollect = () => (
    <RecoveryCollectionStep
      entries={collectionEntries}
      walletAddress={effectiveAddress}
      shamirConfig={recovery.shamirConfig}
      onStatusChange={handleCollectionStatusChange}
      onManualInput={handleManualInput}
    />
  );

  const renderSetPassword = () => (
    <RecoverySetPasswordStep
      newPassword={recovery.newPassword}
      confirmPassword={recovery.confirmNewPassword}
      onNewPasswordChange={recovery.setNewPassword}
      onConfirmPasswordChange={recovery.setConfirmNewPassword}
      recoveredAddress={recovery.recoveredAddress ?? undefined}
    />
  );

  const renderComplete = () => (
    <Alert severity="success">{t('jumperWallet.recovery.success')}</Alert>
  );

  const handleNext = async () => {
    switch (recovery.step) {
      case 'select-sources':
      case 'collect-shares': {
        // Auto-retrieved shares are already in recovery.collectedShares via addCollectedShare.
        // Parse manual text-field inputs as extra shares and pass them directly
        // to reconstructWallet — avoids reading stale state from addCollectedShare.
        const extraShares: ShamirShare[] = [];
        for (const entry of collectionEntries) {
          const raw = entry.manualValue?.trim();
          if (!raw) {
            continue;
          }
          extraShares.push(parseRawShare(raw, recovery.shamirConfig));
        }
        await recovery.reconstructWallet(extraShares);
        break;
      }
      case 'set-password':
        await recovery.completeRecovery();
        break;
      case 'complete':
        recovery.cancelRecovery();
        break;
    }
  };

  return (
    <RecoveryContainer>
      <RecoveryTitle>{t('jumperWallet.recovery.title')}</RecoveryTitle>

      {(recovery.step === 'select-sources' ||
        recovery.step === 'collect-shares') &&
        (needsAddressSelection ? renderSelectWallet() : renderCollect())}
      {recovery.step === 'set-password' && renderSetPassword()}
      {recovery.step === 'complete' && renderComplete()}

      {recovery.error && <Alert severity="error">{recovery.error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {recovery.step !== 'complete' && (
          <ButtonTransparent onClick={recovery.cancelRecovery}>
            {t('jumperWallet.passwordPrompt.cancel')}
          </ButtonTransparent>
        )}
        {!needsAddressSelection && (
          <ButtonPrimary
            onClick={handleNext}
            disabled={recovery.isRecovering}
            startIcon={
              recovery.isRecovering ? <CircularProgress size={16} /> : undefined
            }
          >
            {recovery.step === 'complete'
              ? 'Done'
              : recovery.step === 'set-password'
                ? t('jumperWallet.recovery.finishRecovery')
                : t('jumperWallet.signup.continue')}
          </ButtonPrimary>
        )}
      </Box>
    </RecoveryContainer>
  );
}
