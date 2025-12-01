import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useAccount } from '@lifi/wallet-management';

interface GatekeeperProps extends React.PropsWithChildren {}

enum GatekeeperStatus {
  LOADING = 'loading',
  REQUIRES_CONNECT = 'requires_wallet',
  LOADING_NFT = 'loading_access',
  SUCCESS = 'success',
  ERROR = 'error',
  NOT_ALLOWED = 'not_allowed',
}

interface GatekeeperData {
  status: GatekeeperStatus;
  error?: unknown;
}

const NFT_ADDRESS = '0x0000000000000000000000000000000000000000';

const useGatekeeperStatus = (): GatekeeperData => {
  const account = useAccount();

  console.log('account', account);

  const accountAddress = useAccountAddress();

  console.log('accountAddress', accountAddress);

  return {
    status: GatekeeperStatus.LOADING,
  };
};

export const Gatekeeper: React.FC<GatekeeperProps> = ({ children }) => {
  const { status, error } = useGatekeeperStatus();

  if (status === GatekeeperStatus.LOADING) {
    return <div>Loading...</div>;
  }

  if (status === GatekeeperStatus.REQUIRES_CONNECT) {
    return <div>Requires connect</div>;
  }

  if (status === GatekeeperStatus.LOADING_NFT) {
    return <div>Loading NFT</div>;
  }

  if (status === GatekeeperStatus.ERROR) {
    return <div>Error</div>;
  }

  if (status === GatekeeperStatus.NOT_ALLOWED) {
    return <div>Not allowed</div>;
  }

  return <>{children}</>;
};
