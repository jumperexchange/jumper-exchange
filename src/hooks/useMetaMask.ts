import { useAccounts } from './useAccounts';

export const useMetaMask = () => {
  const { account } = useAccounts();

  const isMMConnector = Boolean(account?.connector?.name === 'MetaMask');

  return {
    isMetaMaskConnector: isMMConnector,
  };
};
