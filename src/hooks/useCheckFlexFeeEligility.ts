'use client';

import { getToken, getTokenBalances, ChainId, Route } from '@lifi/sdk';
import { useAccounts } from './useAccounts';
import { useFlexibleFeeStore } from 'src/stores/flexibleFee';
import { formatUnits } from 'viem';
import { useChains } from 'src/hooks/useChains';

interface TokenBalance {
  amount: bigint;
  decimals: number;
  priceUSD: string;
}

const MIN_AMOUNT_USD = 30;
const NATIVE_TOKEN = '0x0000000000000000000000000000000000000000';

const getUserBalance = async (
  chainId: number,
  tokenAddress: string,
  walletAddress: string,
) => {
  try {
    const token = await getToken(chainId, tokenAddress);
    const tokenBalance = await getTokenBalances(walletAddress, [token]);
    return tokenBalance?.[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const useCheckFlexFeeEligility = () => {
  const {
    setEthPrice,
    setBalanceNative,
    setBalanceNativeInUSD,
    setIsEligible,
    setActiveChain,
  } = useFlexibleFeeStore();
  const { chains } = useChains();
  const { accounts } = useAccounts();
  const activeAccount = accounts.filter((account) => account.isConnected);

  const updateBalanceAndChain = (balance: TokenBalance, chainId: number) => {
    const amount = parseFloat(formatUnits(balance.amount, balance.decimals));
    const amountUSD = amount * parseFloat(balance.priceUSD);
    const ethPrice = amountUSD / amount;

    setEthPrice(ethPrice);
    setBalanceNative(amount);
    setBalanceNativeInUSD(amountUSD);
    setActiveChain(chains?.find((chainEl) => chainEl.id === chainId));
    setIsEligible(true);
  };

  const checkIfChainIsFeeEligible = async (
    chainId: number,
    address: string,
  ) => {
    console.log('hereee');

    const balance = (await getUserBalance(
      chainId,
      NATIVE_TOKEN,
      address,
    )) as TokenBalance;

    console.log(balance);

    if (balance?.amount) {
      const amount = parseFloat(formatUnits(balance.amount, balance.decimals));
      const amountUSD = amount * parseFloat(balance.priceUSD);

      console.log(amountUSD);

      if (amountUSD >= MIN_AMOUNT_USD) {
        updateBalanceAndChain(balance, chainId);
        return true;
      }
    }
    return false;
  };

  const checkEligibilityForFlexibleFee = async (route: Route) => {
    if (
      route.fromChainId == ChainId.SOL ||
      route.toChainId == ChainId.SOL ||
      !activeAccount[0]?.address
    ) {
      return;
    }

    const isSrcEligible = await checkIfChainIsFeeEligible(
      route.fromChainId,
      activeAccount[0]?.address,
    );

    if (isSrcEligible) return;

    await checkIfChainIsFeeEligible(route.toChainId, activeAccount[0]?.address);
  };

  return { checkEligibilityForFlexibleFee };
};
