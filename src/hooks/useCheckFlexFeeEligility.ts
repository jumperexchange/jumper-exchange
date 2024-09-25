'use client';

import { ChainId, Route } from '@lifi/sdk';
import { useTokenBalance } from './useTokenBalance';
import { useAccounts } from './useAccounts';
import { useFlexibleFeeStore } from 'src/stores/flexibleFee';
import { formatUnits } from 'viem';
import { useChains } from 'src/hooks/useChains';

interface TokenBalance {
  amount?: bigint;
  decimals: number;
  priceUSD: string;
}

const MIN_AMOUNT_USD = 2;
const NATIVE_TOKEN = '0x0000000000000000000000000000000000000000';

export const useCheckFlexFeeEligility = (route: Route) => {
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
  const { data: sourceBalance, isLoading: isSourceBalanceLoading } =
    useTokenBalance({
      tokenAddress: NATIVE_TOKEN,
      walletAddress: activeAccount[0]?.address as `0x${string}`,
      chainId: route?.fromChainId,
    });

  const { data: destinationBalance, isLoading: isDestinationBalanceLoading } =
    useTokenBalance({
      tokenAddress: NATIVE_TOKEN,
      walletAddress: activeAccount[0]?.address as `0x${string}`,
      chainId: route?.toChainId,
    });

  const checkEligibilityForFlexibleFee = async (route: Route) => {
    if (route.fromChainId == ChainId.SOL || route.toChainId == ChainId.SOL) {
      return;
    }

    const updateBalanceAndChain = (balance: TokenBalance, chainId: number) => {
      if (!balance.amount) return;
      const amount = parseFloat(formatUnits(balance.amount, balance.decimals));
      const amountUSD = amount * parseFloat(balance.priceUSD);
      const ethPrice = amountUSD / amount;

      setEthPrice(ethPrice);
      setBalanceNative(amount);
      setBalanceNativeInUSD(amountUSD);
      setIsEligible(true);
      setActiveChain(chains?.find((chainEl) => chainEl.id === chainId));
    };

    if (sourceBalance?.amount) {
      const sourceAmount = parseFloat(
        formatUnits(sourceBalance.amount, sourceBalance.decimals),
      );
      const sourceAmountUSD = sourceAmount * parseFloat(sourceBalance.priceUSD);

      if (sourceAmountUSD >= MIN_AMOUNT_USD) {
        updateBalanceAndChain(sourceBalance, route.fromChainId);
        return;
      }
    }

    if (destinationBalance?.amount) {
      const destAmount = parseFloat(
        formatUnits(destinationBalance.amount, destinationBalance.decimals),
      );
      const destAmountUSD =
        destAmount * parseFloat(destinationBalance.priceUSD);

      if (destAmountUSD >= MIN_AMOUNT_USD) {
        updateBalanceAndChain(destinationBalance, route.toChainId);
        return;
      }
    }
  };

  return { checkEligibilityForFlexibleFee };
};
