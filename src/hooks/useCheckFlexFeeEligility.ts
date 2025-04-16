'use client';

import type { Route } from '@lifi/sdk';
import { ChainId, getToken, getTokenBalances } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { useChains } from 'src/hooks/useChains';
import { useFlexibleFeeStore } from 'src/stores/flexibleFee/FlexibleFeeStore';
import { formatUnits } from 'viem';

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
    console.error(err);
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
  const { accounts } = useAccount();
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
    // eslint-disable-next-line no-console
    console.log('hereee');

    const balance = (await getUserBalance(
      chainId,
      NATIVE_TOKEN,
      address,
    )) as TokenBalance;

    // eslint-disable-next-line no-console
    console.log(balance);

    if (balance?.amount) {
      const amount = parseFloat(formatUnits(balance.amount, balance.decimals));
      const amountUSD = amount * parseFloat(balance.priceUSD);

      // eslint-disable-next-line no-console
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

    if (isSrcEligible) {
      return;
    }

    await checkIfChainIsFeeEligible(route.toChainId, activeAccount[0]?.address);
  };

  return { checkEligibilityForFlexibleFee };
};
