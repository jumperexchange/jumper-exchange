'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { createPublicClient, http, formatEther } from 'viem';
import { mainnet } from 'viem/chains';
import { useTranslation } from 'react-i18next';
import {
  ButtonPrimary,
  ButtonTransparent,
} from '@/components/Button/Button.style';
import { StepContent } from '../SignUp/SignUpWizard.style';

interface WalletSelectionStepProps {
  /** Addresses discovered from localStorage recovery shares. */
  addresses: string[];
  /** Called when the user picks a discovered address. */
  onSelect: (address: string) => void;
  /** Called when the user wants to recover an address that was never stored on this device. */
  onRecoverWithoutAddress: () => void;
}

interface WalletOption {
  address: string;
  ethBalance: string | null;
  loading: boolean;
}

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

function truncateAddress(address: string): string {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletSelectionStep({
  addresses,
  onSelect,
  onRecoverWithoutAddress,
}: WalletSelectionStepProps) {
  const { t } = useTranslation();

  const [options, setOptions] = useState<WalletOption[]>(
    addresses.map((address) => ({ address, ethBalance: null, loading: true })),
  );

  useEffect(() => {
    for (const address of addresses) {
      publicClient
        .getBalance({ address: address as `0x${string}` })
        .then((balance) => {
          setOptions((prev) =>
            prev.map((o) =>
              o.address === address
                ? {
                    ...o,
                    ethBalance: `${Number(formatEther(balance)).toFixed(4)} ETH`,
                    loading: false,
                  }
                : o,
            ),
          );
        })
        .catch(() => {
          setOptions((prev) =>
            prev.map((o) =>
              o.address === address
                ? { ...o, ethBalance: null, loading: false }
                : o,
            ),
          );
        });
    }
  }, [addresses]);

  return (
    <StepContent>
      <Typography variant="subtitle1" fontWeight={600}>
        {t('jumperWallet.recovery.selectWallet.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('jumperWallet.recovery.selectWallet.subtitle', {
          count: addresses.length,
        })}
      </Typography>

      {addresses.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('jumperWallet.recovery.selectWallet.noWalletsFound')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {options.map((option) => (
            <Box
              key={option.address}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 2,
                py: 1.5,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  fontFamily="monospace"
                >
                  {truncateAddress(option.address)}
                </Typography>
                {option.loading ? (
                  <CircularProgress size={12} sx={{ mt: 0.5 }} />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {option.ethBalance ?? '—'}
                  </Typography>
                )}
              </Box>
              <ButtonPrimary
                size="small"
                onClick={() => onSelect(option.address)}
              >
                {t('jumperWallet.recovery.selectWallet.selectButton')}
              </ButtonPrimary>
            </Box>
          ))}
        </Box>
      )}

      <ButtonTransparent
        onClick={onRecoverWithoutAddress}
        sx={{ alignSelf: 'center', mt: 1 }}
      >
        {t('jumperWallet.recovery.selectWallet.recoverWithoutDevice')}
      </ButtonTransparent>
    </StepContent>
  );
}
