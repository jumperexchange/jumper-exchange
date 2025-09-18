import { ChainType } from '@lifi/sdk';
import { Account, useAccount } from '@lifi/wallet-management';
import { useEffect, useState } from 'react';
import { useMultisig } from 'src/hooks/useMultisig';
import { checkIsEmbeddedWallet } from 'src/utils/wallets/checkIsEmbeddedWallet';

export const useShowZapPlaceholderWidget = (account: Account) => {
  const { checkMultisigEnvironment } = useMultisig();
  const [isMultisigEnvironment, setIsMultisigEnvironment] = useState(false);
  const [isEmbeddedWallet, setIsEmbeddedWallet] = useState(false);

  useEffect(() => {
    const checkEnvironment = async () => {
      const _isMultisigEnvironment = await checkMultisigEnvironment();
      setIsMultisigEnvironment(_isMultisigEnvironment);
    };

    checkEnvironment();
  }, [checkMultisigEnvironment]);

  useEffect(() => {
    const checkEmbeddedWallet = async () => {
      const _isEmbeddedWallet = checkIsEmbeddedWallet(account);
      setIsEmbeddedWallet(_isEmbeddedWallet);
    };

    checkEmbeddedWallet();
  }, [account]);

  return isMultisigEnvironment || isEmbeddedWallet;
};
