import { useAccount } from '@jumperexchange/wallet-management';

export const useMetaMask = () => {
  const { account } = useAccount();

  const isMMConnector = Boolean(account?.connector?.name === 'MetaMask');

  return {
    isMetaMaskConnector: isMMConnector,
  };
};
