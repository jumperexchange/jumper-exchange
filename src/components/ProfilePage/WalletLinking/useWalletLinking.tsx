import { useAccount } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import { Warning } from 'src/components/illustrations/Warning';
import { WalletCardBox } from '../WalletCardBox/WalletCardBox';
import WalletLinkingStepper from './WalletLinkingStepper';

interface UseWalletLinkingProps {
  menuIndex: number;
  setMenuIndex: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const useWalletLinking = ({
  menuIndex,
  setMenuIndex,
  setOpen,
}: UseWalletLinkingProps) => {
  const { accounts } = useAccount();

  const data = [
    {
      title: 'Link wallets to combine XP',
      buttonLabel: 'Continue',
      content: (
        <>
          {accounts.map(
            (account) =>
              account.isConnected && (
                <WalletCardBox
                  key={account.address}
                  chainType={account.chainType}
                  account={account}
                />
              ),
          )}
        </>
      ),
      text: 'You’ll have a combined 1,259 XP. It is calculated at 100% XP from EVM and 30% XP from Solana of linked wallets to maintain fairness for early adopters.',
      onClick: () => {
        setMenuIndex((state) => state + 1);
      },
    },
    {
      buttonLabel: 'Agree and continue',
      content: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Warning />
          <Typography variant="titleXSmall">Warning</Typography>
        </Box>
      ),
      text: 'In order to link wallets you’ll be asked to sign with each wallet. By continuing you agree that wallet information may be found on-chain.',
      onClick: () => {
        setMenuIndex((state) => state + 1);
      },
    },
    {
      title: 'Sign with wallets',
      buttonLabel: 'Sign with EVM',
      content: (
        <WalletLinkingStepper
          step={1}
          maxSteps={3}
          completed={true}
          onClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      onClick: () => {
        setMenuIndex((state) => state + 1);
      },
    },
    {
      title: 'Sign with wallets',
      buttonLabel: 'Sign with Solana',
      content: (
        <WalletLinkingStepper
          step={2}
          maxSteps={3}
          completed={true}
          onClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      onClick: () => {
        setMenuIndex((state) => state + 1);
      },
    },
    {
      title: 'Sign with wallets',
      buttonLabel: 'Sign with Solana',
      content: (
        <WalletLinkingStepper
          step={2}
          maxSteps={3}
          completed={true}
          onClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      onClick: () => {
        setMenuIndex((state) => state + 1);
      },
    },
    {
      buttonLabel: 'Done',
      text: 'You now have a combined 1,259 XP. You can unlink wallets anytime to separate XP.',
      content: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#D6FFE7',
              width: '96px',
              height: '96px',
              borderRadius: '48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CheckIcon
              sx={{ width: '48px', height: '48px', color: '#00B849' }}
            />
          </Box>
          <Typography variant="titleXSmall">
            Wallets linked successfully
          </Typography>
        </Box>
      ),
      onClick: () => {
        setOpen(false);
        setMenuIndex(0);
      },
    },
  ];

  return {
    data,
    maxSteps: data.length,
  };
};
