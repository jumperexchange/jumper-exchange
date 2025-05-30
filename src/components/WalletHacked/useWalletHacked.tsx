import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import {
  useAccount,
  useAccountDisconnect,
  useWalletMenu,
} from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SiweMessage, generateNonce } from 'siwe';
import { useSignMessage } from 'wagmi';

type Step = 'intro' | 'source' | 'destination' | 'summary' | 'success';

interface StepContent {
  title: string;
  description: string;
  buttonLabel: string;
  content?: React.ReactNode;
  onClick: () => void;
  showWalletAddress?: boolean;
  walletAddress?: string | null;
}

interface UseWalletHackedProps {}

export const useWalletHacked = ({}: UseWalletHackedProps = {}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { account } = useAccount();
  const disconnectWallet = useAccountDisconnect();
  const { openWalletMenu } = useWalletMenu();
  const { signMessageAsync } = useSignMessage();
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [sourceWallet, setSourceWallet] = useState<string | null>(null);
  const [destinationWallet, setDestinationWallet] = useState<string | null>(
    null,
  );
  const [menuIndex, setMenuIndex] = useState(0);
  const [sourceWalletVerified, setSourceWalletVerified] = useState(false);
  const [sourceWalletSigned, setSourceWalletSigned] = useState(false);
  const [destinationWalletVerified, setDestinationWalletVerified] =
    useState(false);
  const [destinationWalletSigned, setDestinationWalletSigned] = useState(false);
  const [sourceSignature, setSourceSignature] = useState<string | null>(null);
  const [sourceMessage, setSourceMessage] = useState<string | null>(null);
  const [destinationSignature, setDestinationSignature] = useState<
    string | null
  >(null);
  const [destinationMessage, setDestinationMessage] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const { points: sourcePoints } = useLoyaltyPass(sourceWallet || '');
  const hasHandledWalletConnection = useRef(false);
  const isConnectingWallet = useRef(false);
  const previousAccount = useRef<string | null>(null);

  // Reset states when wallet menu is closed without connecting
  useEffect(() => {
    // If we had an account and now we don't, the wallet was disconnected
    if (previousAccount.current && !account?.address) {
      isConnectingWallet.current = false;
      hasHandledWalletConnection.current = false;
    }
    previousAccount.current = account?.address || null;
  }, [account?.address]);

  const handleContinue = useCallback(() => {
    switch (currentStep) {
      case 'intro':
        setCurrentStep('source');
        break;
      case 'source':
        if (sourceWalletSigned) {
          setCurrentStep('destination');
        }
        break;
      case 'destination':
        if (destinationWalletSigned) {
          setCurrentStep('summary');
        }
        break;
      case 'success':
        // Reset the form
        setCurrentStep('intro');
        setSourceWallet(null);
        setDestinationWallet(null);
        setSourceWalletVerified(false);
        setSourceWalletSigned(false);
        setDestinationWalletVerified(false);
        setDestinationWalletSigned(false);
        setSourceSignature(null);
        setSourceMessage(null);
        setDestinationSignature(null);
        setDestinationMessage(null);
        setError(null);
        break;
      default:
        break;
    }
  }, [currentStep, sourceWalletSigned, destinationWalletSigned]);

  const handleVerifyWallet = useCallback(
    async (type: 'source' | 'destination') => {
      setError(null);
      if (!account?.address) {
        setError(t('walletHacked.errors.noWalletConnected'));
        return;
      }

      // Check for EVM wallet
      if (account.chainType !== 'EVM') {
        setError(t('walletHacked.errors.nonEVMWallet'));
        // Reset connection states to allow retrying
        hasHandledWalletConnection.current = false;
        isConnectingWallet.current = false;
        return;
      }

      // Check for duplicate wallets
      if (type === 'source' && account.address === destinationWallet) {
        setError(t('walletHacked.errors.sameWalletAsDestination'));
        // Reset connection states to allow retrying
        hasHandledWalletConnection.current = false;
        isConnectingWallet.current = false;
        return;
      }
      if (type === 'destination' && account.address === sourceWallet) {
        setError(t('walletHacked.errors.sameWalletAsSource'));
        // Reset connection states to allow retrying
        hasHandledWalletConnection.current = false;
        isConnectingWallet.current = false;
        return;
      }

      if (type === 'source') {
        setSourceWalletVerified(true);
      } else {
        setDestinationWalletVerified(true);
      }
    },
    [account?.address, account?.chainType, destinationWallet, sourceWallet, t],
  );

  const handleSignMessage = useCallback(
    async (type: 'source' | 'destination') => {
      try {
        setError(null);
        const walletAddress =
          type === 'source' ? sourceWallet : destinationWallet;
        if (!walletAddress || !account) {
          throw new Error('No wallet connected');
        }

        const nonce = generateNonce();
        const message = new SiweMessage({
          domain: window.location.host,
          address: walletAddress,
          statement:
            type === 'source'
              ? `I confirm that I own this wallet and want to transfer my ${sourcePoints} XP points to a new wallet.`
              : `I confirm that I own this wallet and want to receive ${sourcePoints} XP points from another wallet.`,
          uri: window.location.origin,
          version: '1',
          chainId: 1,
          nonce,
        });

        const messageToSign = message.prepareMessage();
        const signature = await signMessageAsync({
          account: walletAddress as `0x${string}`,
          message: messageToSign,
        });

        if (type === 'source') {
          setSourceMessage(messageToSign);
          setSourceSignature(signature);
          setSourceWalletSigned(true);
          disconnectWallet(account);
        } else {
          setDestinationMessage(messageToSign);
          setDestinationSignature(signature);
          setDestinationWalletSigned(true);
          disconnectWallet(account);
        }
      } catch (error) {
        console.error('Signing failed:', error);
        setError(t('walletHacked.errors.signingFailed'));
        // Reset connection states to allow retrying
        hasHandledWalletConnection.current = false;
        isConnectingWallet.current = false;
      }
    },
    [
      sourceWallet,
      destinationWallet,
      account,
      sourcePoints,
      signMessageAsync,
      disconnectWallet,
      t,
    ],
  );

  const handleSubmit = useCallback(async () => {
    if (!sourceWallet || !destinationWallet) {
      setError(t('walletHacked.errors.noWalletConnected'));
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${apiBaseUrl}/auth/verify-wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin_wallet: {
            address: sourceWallet,
            message: sourceMessage,
            signature: sourceSignature,
          },
          destination_wallet: {
            address: destinationWallet,
            message: destinationMessage,
            signature: destinationSignature,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit transfer request');
      }

      const responseData = await response.json();
      const verificationId = responseData.data.verification_id;
      setCurrentStep('success');
      return { success: true, verificationId };
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to submit transfer request',
      );
    }
  }, [
    sourceWallet,
    destinationWallet,
    sourceSignature,
    destinationSignature,
    sourceMessage,
    destinationMessage,
    t,
  ]);

  // Handle wallet connection
  useEffect(() => {
    if (
      account?.address &&
      !hasHandledWalletConnection.current &&
      !isConnectingWallet.current
    ) {
      hasHandledWalletConnection.current = true;

      // Check for EVM wallet
      if (account.chainType !== 'EVM') {
        setError(t('walletHacked.errors.nonEVMWallet'));
        // Reset connection states and disconnect wallet
        hasHandledWalletConnection.current = false;
        isConnectingWallet.current = false;
        disconnectWallet(account);
        return;
      }

      if (currentStep === 'source' && !sourceWallet) {
        if (account.address === destinationWallet) {
          setError(t('walletHacked.errors.sameWalletAsDestination'));
          // Reset connection states and disconnect wallet
          hasHandledWalletConnection.current = false;
          isConnectingWallet.current = false;
          disconnectWallet(account);
          return;
        }
        setError(null);
        setSourceWallet(account.address);
      } else if (currentStep === 'destination' && !destinationWallet) {
        if (account.address === sourceWallet) {
          setError(t('walletHacked.errors.sameWalletAsSource'));
          // Reset connection states and disconnect wallet
          hasHandledWalletConnection.current = false;
          isConnectingWallet.current = false;
          disconnectWallet(account);
          return;
        }
        setError(null);
        setDestinationWallet(account.address);
      }
    }
  }, [
    account.address,
    account.chainType,
    currentStep,
    sourceWallet,
    destinationWallet,
    t,
    disconnectWallet,
    account,
  ]);

  const handleConnectSourceWallet = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();

      // Clear error when user explicitly tries to connect
      setError(null);
      isConnectingWallet.current = true;
      hasHandledWalletConnection.current = false;

      // If there's a wallet connected, disconnect it first
      if (account?.address) {
        disconnectWallet(account);
      }

      openWalletMenu();
    },
    [openWalletMenu, account, disconnectWallet],
  );

  const handleConnectDestinationWallet = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();

      // Clear error when user explicitly tries to connect
      setError(null);
      isConnectingWallet.current = true;
      hasHandledWalletConnection.current = false;

      // If there's a wallet connected, disconnect it first
      if (account?.address) {
        disconnectWallet(account);
      }

      openWalletMenu();
    },
    [openWalletMenu, account, disconnectWallet],
  );

  const getButtonLabel = useCallback((): string => {
    switch (currentStep) {
      case 'intro':
        return t('walletHacked.actions.continue');
      case 'source':
        if (!sourceWallet) {
          return t('walletHacked.actions.connectWallet');
        }
        if (!sourceWalletVerified) {
          return t('walletHacked.actions.verifyWallet');
        }
        if (!sourceWalletSigned) {
          return t('walletHacked.actions.sign');
        }
        return t('walletHacked.actions.continue');
      case 'destination':
        if (!destinationWallet) {
          return t('walletHacked.actions.connectWallet');
        }
        if (!destinationWalletVerified) {
          return t('walletHacked.actions.verifyWallet');
        }
        if (!destinationWalletSigned) {
          return t('walletHacked.actions.sign');
        }
        return t('walletHacked.actions.continue');
      case 'summary':
        return t('walletHacked.actions.submit');
      case 'success':
        return t('walletHacked.actions.done');
      default:
        return '';
    }
  }, [
    currentStep,
    sourceWallet,
    sourceWalletVerified,
    sourceWalletSigned,
    destinationWallet,
    destinationWalletVerified,
    destinationWalletSigned,
    t,
  ]);

  const getOnClick = useCallback((): ((event?: React.MouseEvent) => void) => {
    switch (currentStep) {
      case 'intro':
        return handleContinue;
      case 'source':
        if (!sourceWallet) {
          if (!account?.address) {
            return handleConnectSourceWallet;
          }
          // Check for duplicate wallet before setting
          if (account.address === destinationWallet) {
            setError(t('walletHacked.errors.sameWalletAsDestination'));
            return handleConnectSourceWallet;
          }
          setSourceWallet(account.address);
          return handleVerifyWallet.bind(null, 'source');
        }
        if (!sourceWalletVerified) {
          return handleVerifyWallet.bind(null, 'source');
        }
        if (!sourceWalletSigned) {
          return handleSignMessage.bind(null, 'source');
        }
        return handleContinue;
      case 'destination':
        if (!destinationWallet) {
          if (!account?.address) {
            return handleConnectDestinationWallet;
          }
          // Check for duplicate wallet before setting
          if (account.address === sourceWallet) {
            setError(t('walletHacked.errors.sameWalletAsSource'));
            return handleConnectDestinationWallet;
          }
          setDestinationWallet(account.address);
          return handleVerifyWallet.bind(null, 'destination');
        }
        if (!destinationWalletVerified) {
          return handleVerifyWallet.bind(null, 'destination');
        }
        if (!destinationWalletSigned) {
          return handleSignMessage.bind(null, 'destination');
        }
        return handleContinue;
      case 'summary':
        return handleSubmit;
      case 'success':
        return () => {
          // Reset the form or close the modal
          setCurrentStep('intro');
          setSourceWallet(null);
          setDestinationWallet(null);
          setSourceWalletVerified(false);
          setSourceWalletSigned(false);
          setDestinationWalletVerified(false);
          setDestinationWalletSigned(false);
          setSourceSignature(null);
          setSourceMessage(null);
          setDestinationSignature(null);
          setDestinationMessage(null);
          setError(null);
          // Redirect to homepage
          router.push('/');
        };
      default:
        return () => {};
    }
  }, [
    currentStep,
    sourceWallet,
    sourceWalletVerified,
    sourceWalletSigned,
    destinationWallet,
    destinationWalletVerified,
    destinationWalletSigned,
    account,
    handleContinue,
    handleConnectSourceWallet,
    handleConnectDestinationWallet,
    handleVerifyWallet,
    handleSignMessage,
    handleSubmit,
    setError,
    t,
    router,
  ]);

  const getStepContent = useCallback((): StepContent => {
    switch (currentStep) {
      case 'intro':
        return {
          title: t('walletHacked.steps.intro.title'),
          description: t('walletHacked.steps.intro.description'),
          buttonLabel: t('walletHacked.actions.continue'),
          onClick: getOnClick,
        };
      case 'source':
        if (!sourceWallet) {
          return {
            title: t('walletHacked.steps.source.title'),
            description: t('walletHacked.steps.source.connectDescription'),
            buttonLabel: t('walletHacked.actions.connectWallet'),
            onClick: getOnClick,
            content: error ? (
              <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            ) : undefined,
          };
        }
        if (!sourceWalletVerified) {
          return {
            title: t('walletHacked.steps.source.title'),
            description: t('walletHacked.steps.source.verifyDescription'),
            buttonLabel: !account?.address
              ? t('walletHacked.actions.connectWallet')
              : t('walletHacked.actions.verifyWallet'),
            onClick: getOnClick,
            showWalletAddress: true,
            walletAddress: sourceWallet,
            content: error ? (
              <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            ) : undefined,
          };
        }
        if (!sourceWalletSigned) {
          return {
            title: t('walletHacked.steps.source.title'),
            description: t('walletHacked.steps.source.signDescription'),
            buttonLabel: !account?.address
              ? t('walletHacked.actions.connectWallet')
              : t('walletHacked.actions.sign'),
            onClick: getOnClick,
            showWalletAddress: true,
            walletAddress: sourceWallet,
            content: error ? (
              <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            ) : undefined,
          };
        }
        return {
          title: t('walletHacked.steps.source.title'),
          description: t('walletHacked.steps.source.readyDescription'),
          buttonLabel: t('walletHacked.actions.continue'),
          onClick: getOnClick,
          showWalletAddress: true,
          walletAddress: sourceWallet,
          content: error ? (
            <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
              {error}
            </div>
          ) : undefined,
        };
      case 'destination':
        if (!destinationWallet) {
          return {
            title: t('walletHacked.steps.destination.title'),
            description: t('walletHacked.steps.destination.connectDescription'),
            buttonLabel: t('walletHacked.actions.connectWallet'),
            onClick: getOnClick,
            content: error ? (
              <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            ) : undefined,
          };
        }
        if (!destinationWalletVerified) {
          return {
            title: t('walletHacked.steps.destination.title'),
            description: t('walletHacked.steps.destination.verifyDescription'),
            buttonLabel: !account?.address
              ? t('walletHacked.actions.connectWallet')
              : t('walletHacked.actions.verifyWallet'),
            onClick: getOnClick,
            showWalletAddress: true,
            walletAddress: destinationWallet,
            content: error ? (
              <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            ) : undefined,
          };
        }
        if (!destinationWalletSigned) {
          return {
            title: t('walletHacked.steps.destination.title'),
            description: t('walletHacked.steps.destination.signDescription'),
            buttonLabel: !account?.address
              ? t('walletHacked.actions.connectWallet')
              : t('walletHacked.actions.sign'),
            onClick: getOnClick,
            showWalletAddress: true,
            walletAddress: destinationWallet,
            content: error ? (
              <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            ) : undefined,
          };
        }
        return {
          title: t('walletHacked.steps.destination.title'),
          description: t('walletHacked.steps.destination.readyDescription'),
          buttonLabel: t('walletHacked.actions.continue'),
          onClick: getOnClick,
          showWalletAddress: true,
          walletAddress: destinationWallet,
          content: error ? (
            <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
              {error}
            </div>
          ) : undefined,
        };
      case 'summary':
        return {
          title: t('walletHacked.steps.summary.title'),
          description: t('walletHacked.steps.summary.description', {
            points: sourcePoints || 0,
            sourceWallet: sourceWallet || '',
            destinationWallet: destinationWallet || '',
          }),
          buttonLabel: t('walletHacked.actions.submit'),
          onClick: getOnClick,
          content: error ? (
            <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
              {error}
            </div>
          ) : undefined,
        };
      case 'success':
        return {
          title: t('walletHacked.steps.success.title'),
          description: t('walletHacked.steps.success.description'),
          buttonLabel: t('walletHacked.actions.done'),
          onClick: getOnClick,
          content: (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: '#D6FFE7',
                  width: '96px',
                  height: '96px',
                  alignItems: 'center',
                  borderRadius: '48px',
                  margin: 'auto',
                }}
              >
                <CheckIcon sx={{ color: '#00B849', fontSize: '48px' }} />
              </div>
            </div>
          ),
        };
      default:
        return {
          title: '',
          description: '',
          buttonLabel: '',
          onClick: () => {},
        };
    }
  }, [
    currentStep,
    t,
    sourceWallet,
    sourceWalletVerified,
    sourceWalletSigned,
    error,
    destinationWallet,
    destinationWalletVerified,
    destinationWalletSigned,
    sourcePoints,
    account?.address,
    getOnClick,
  ]);

  return {
    currentStep,
    sourceWallet,
    destinationWallet,
    menuIndex,
    setMenuIndex,
    getStepContent,
    getButtonLabel,
    getOnClick,
    handleSignMessage,
    sourceWalletVerified,
    sourceWalletSigned,
    destinationWalletVerified,
    destinationWalletSigned,
  };
};
