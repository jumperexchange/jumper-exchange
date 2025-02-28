import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { Box, lighten, Typography } from '@mui/material';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Warning } from 'src/components/illustrations/Warning';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useSignEVM, useSignSolana } from 'src/hooks/useWalletSignature';
import { useWalletVerification } from 'src/hooks/useWalletVerification';
import { WalletCardBox } from '../WalletCardBox/WalletCardBox';
import WalletLinkingStepper from './WalletLinkingStepper';
interface UseWalletLinkingProps {
  menuIndex: number;
  setMenuIndex: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function sumArray(arr: (number | undefined)[]): number {
  return arr.reduce((sum: number, num: number | undefined) => {
    if (typeof num === 'number' && !Number.isNaN(num)) {
      return sum + num;
    }
    return sum;
  }, 0);
}

export const useWalletLinking = ({
  menuIndex,
  setMenuIndex,
  setOpen,
}: UseWalletLinkingProps) => {
  const { accounts } = useAccount();
  const { signEVM, evmMessage, evmSignature } = useSignEVM();
  const { signSolana, solanaPublicKey, solanaSignature } = useSignSolana();
  const [startWalletsVerification, setStartWalletsVerification] =
    useState(false);

  const evmWallet = accounts.find(
    (account) => account.chainType === ChainType.EVM,
  );
  const svmWallet = accounts.find(
    (account) => account.chainType === ChainType.SVM,
  );
  const { points: evmPoints } = useLoyaltyPass(evmWallet?.address);
  const { points: svmPoints } = useLoyaltyPass(svmWallet?.address);

  const combinedPoints = useMemo(() => {
    return sumArray([evmPoints, !!svmPoints ? svmPoints * 0.3 : undefined]);
  }, [evmPoints, svmPoints]);

  const { data: verificationData } = useWalletVerification({
    evmAddress: evmWallet?.address,
    evmMessage,
    evmSignature,
    solanaPublicKey,
    solanaSignature: solanaSignature,
    queryKey: `${evmWallet?.address}-${solanaPublicKey}-${startWalletsVerification}`,
    enabled: startWalletsVerification && !!evmSignature && !!solanaSignature,
  });

  const data = useMemo(() => {
    const evmHandler = () => {
      !evmSignature ? signEVM() : setMenuIndex((state) => state + 1);
    };
    const solanaHandler = () => {
      !solanaSignature ? signSolana() : setMenuIndex((state) => state + 1);
    };

    const verifyEvmAndSolHandler = () => {
      setStartWalletsVerification(true);
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
        text: `You’ll have a ${
          combinedPoints
        } combined XP. It is calculated at 100% XP from EVM and 30% XP from Solana of linked wallets to maintain fairness for early adopters.`,
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
          verificationData?.data.evm && verificationData?.data.solana
            ? setMenuIndex(4)
            : setMenuIndex((state) => state + 1);
        },
      },
      {
        title: 'Sign with wallets',
        buttonLabel: !evmSignature ? 'Sign with EVM' : 'Continue',
        completed: !!evmSignature,
        content: (
          <WalletLinkingStepper
            step={1}
            maxSteps={3}
            evmSigned={!!evmSignature} //{evmSignature !== ''}
            svmSigned={!!solanaSignature}
            onClick={evmHandler}
          />
        ),
        onClick: () => {
          evmHandler();
        },
      },
      {
        title: 'Sign with wallets',
        buttonLabel: !solanaSignature ? 'Verify wallet SVM' : 'Continue',
        completed: !!solanaSignature,
        content: (
          <WalletLinkingStepper
            step={2}
            maxSteps={3}
            evmSigned={!!evmSignature}
            svmSigned={!!solanaSignature}
            evmVerified={verificationData?.data.evm}
            svmVerified={verificationData?.data.solana}
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
        buttonLabel: !verificationData
          ? 'Verify wallet signatures'
          : 'Continue',
        // evmSignature !== '' && solanaSignature !== ''
        //   ? 'Verify signatures'
        //   : 'Continue',
        completed: false, //evmSignature !== '' && solanaSignature !== '', // todo: finish this step to use verifySignatures() response
        content: (
          <WalletLinkingStepper
            step={3}
            maxSteps={3}
            startWalletsVerification={startWalletsVerification}
            evmSigned={!!evmSignature}
            svmSigned={!!solanaSignature}
            evmVerified={verificationData?.data.evm}
            svmVerified={verificationData?.data.solana}
            evmAndSvmCompleted={
              verificationData?.data.evm && verificationData?.data.solana
            }
            onClick={verifyEvmAndSolHandler}
          />
        ),
        onClick: () => {
          !startWalletsVerification
            ? verifyEvmAndSolHandler()
            : setMenuIndex((state) => state + 1);
        },
      },
      {
        buttonLabel: 'Done',
        text:
          verificationData?.data.evm &&
          verificationData?.data.solana &&
          evmPoints &&
          !!svmPoints
            ? `You now have a combined ${combinedPoints} XP. You can unlink wallets anytime to separate XP.`
            : 'There was an error verifying your wallet signatures.',
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
              sx={(theme) => ({
                backgroundColor:
                  verificationData?.data.evm && verificationData?.data.solana
                    ? '#D6FFE7'
                    : lighten(theme.palette.error.main, 0.8),
                width: '96px',
                height: '96px',
                borderRadius: '48px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              })}
            >
              {verificationData?.data.evm && verificationData?.data.solana ? (
                <CheckIcon
                  sx={{ width: '48px', height: '48px', color: '#00B849' }}
                />
              ) : (
                <PriorityHighIcon
                  sx={(theme) => ({
                    width: '48px',
                    height: '48px',
                    color: theme.palette.error.main,
                  })}
                />
              )}
            </Box>
            <Typography variant="titleXSmall" sx={{ textAlign: 'center' }}>
              {verificationData?.data.evm && verificationData?.data.solana
                ? 'Wallets linked successfully'
                : 'Error verifying wallets'}
            </Typography>
          </Box>
        ),
        onClick: () => {
          setOpen(false);
          setMenuIndex(0);
          setStartWalletsVerification(false);
        },
      },
    ];
  }, [
    accounts,
    combinedPoints,
    evmPoints,
    evmSignature,
    setMenuIndex,
    setOpen,
    signEVM,
    signSolana,
    solanaSignature,
    startWalletsVerification,
    svmPoints,
    verificationData,
  ]);

  return {
    data,
    maxSteps: data.length,
  };
};
