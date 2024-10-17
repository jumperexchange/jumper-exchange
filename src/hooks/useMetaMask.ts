import { useAccount } from '@lifi/wallet-management';

export const useMetaMask = () => {
  const { account } = useAccount();

  const isMMConnector = Boolean(account?.connector?.name === 'MetaMask');

  return {
    isMetaMaskConnector: isMMConnector,
  };
};
