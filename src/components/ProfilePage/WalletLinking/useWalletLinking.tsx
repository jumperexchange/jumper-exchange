import { useAccount } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Typography } from '@mui/material';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { Warning } from 'src/components/illustrations/Warning';
import { useWalletSignature } from 'src/hooks/useWalletSignature';
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
  const {
    loading,
    signEVM,
    signSolana,
    verifySignatures,
    verificationResult,
    evmSignature,
    solanaSignature,
  } = useWalletSignature();

  // console.log({
  //   evmSignature,
  //   solanaSignature,
  //   loading,
  //   signEVM,
  //   signSolana,
  //   verifySignatures,
  //   verificationResult,
  // });

  const data = useMemo(() => {
    const evmHandler = () =>
      evmSignature === '' ? signEVM() : setMenuIndex((state) => state + 1);

    const solanaHandler = () =>
      solanaSignature === ''
        ? signSolana()
        : setMenuIndex((state) => state + 1);

    const verifyHandler = () => {
      verifySignatures();
      setMenuIndex((state) => state + 1);
    };

    return [
      {
        title: 'Link wallets to combine XP',
        buttonLabel: 'Continue',
        onClick: () => {
          setMenuIndex((state) => state + 1);
        },
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
        buttonLabel: evmSignature === '' ? 'Sign with EVM' : 'Continue',
        completed: evmSignature !== '',
        content: (
          <WalletLinkingStepper
            step={1}
            maxSteps={3}
            completed={evmSignature !== ''}
            onClick={evmHandler}
          />
        ),
        onClick: () => {
          evmHandler();
        },
      },
      {
        title: 'Sign with wallets',
        buttonLabel: solanaSignature === '' ? 'Sign with Solana' : 'Continue',
        completed: false,
        content: (
          <WalletLinkingStepper
            step={2}
            maxSteps={3}
            completed={solanaSignature !== ''}
            onClick={solanaHandler}
          />
        ),
        onClick: () => {
          solanaHandler();
        },
      },
      {
        // todo: finish this step -->
        title: 'Sign with wallets',
        buttonLabel:
          evmSignature !== '' && solanaSignature !== ''
            ? 'Verify signatures'
            : 'Continue',
        completed: evmSignature !== '' && solanaSignature !== '', // todo: finish this step to use verifySignatures() response
        content: (
          <WalletLinkingStepper
            step={3}
            maxSteps={3}
            completed={evmSignature !== '' && solanaSignature !== ''}
            onClick={verifyHandler}
          />
        ),
        onClick: () => {
          verifyHandler();
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
  }, [
    accounts,
    evmSignature,
    setMenuIndex,
    setOpen,
    signEVM,
    signSolana,
    solanaSignature,
    verifySignatures,
  ]);

  return {
    data,
    maxSteps: data.length,
  };
};
