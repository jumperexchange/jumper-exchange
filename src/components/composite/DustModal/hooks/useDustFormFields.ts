import { useCallback, useMemo } from 'react';
import {
  defineNumericSelectField,
  defineChainSingleSelectField,
  defineBalancesMultiSelectField,
  defineDisplayAmountField,
} from '@/components/composite/JumperWidget/utils';
import type { ChainSingleSelectValue } from '@/components/composite/JumperWidget/components/Chain';
import type { NumericSelectValue } from '@/components/composite/JumperWidget/components/NumericSelect';
import type { BalancesMultiSelectValue } from '@/components/composite/JumperWidget/components/Balances';
import type {
  PortfolioBalance,
  WalletToken,
  ExtendedToken,
} from '@/types/tokens';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import type { ExtendedChain } from '@lifi/sdk';

const INITIAL_THRESHOLD_USD = 0.5;

const checkBalanceAboveThreshold = (
  balance: PortfolioBalance<WalletToken>,
  minUsd: number,
): boolean => balance.amountUSD - minUsd > Number.EPSILON;

interface UseDustFormFieldsParams {
  chains: ExtendedChain[];
  nonNativeBalances: PortfolioBalance<WalletToken>[];
  nativeExtendedTokens: ExtendedToken[];
  fallbackNativeToken: ExtendedToken;
}

export const useDustFormFields = ({
  chains,
  nonNativeBalances,
  nativeExtendedTokens,
  fallbackNativeToken,
}: UseDustFormFieldsParams) => {
  const { toInputAmount, toAmountFromPrice, toRawAmount, usdDecimals } =
    useTokenAmountInput();

  const checkChainHasBalancesAboveThreshold = useCallback(
    (chainId: number, minUsd: number): boolean =>
      nonNativeBalances
        .filter((b) => b.token.chainId === chainId)
        .some((b) => checkBalanceAboveThreshold(b, minUsd)),
    [nonNativeBalances],
  );

  const getFilteredBalances = useCallback(
    (chainId: number, minUsd: number) =>
      nonNativeBalances
        .filter((b) => b.token.chainId === chainId)
        .filter((b) => checkBalanceAboveThreshold(b, minUsd)),
    [nonNativeBalances],
  );

  const computeAmounts = useCallback(
    (
      filteredBalances: PortfolioBalance<WalletToken>[],
      selectedAddresses: string[],
      token: ExtendedToken,
    ) => {
      const toTokenStr = (usd: number) =>
        toAmountFromPrice(
          toInputAmount(usd.toString(), usdDecimals),
          token.priceUSD,
        );

      const maxAmountUSD = filteredBalances.reduce(
        (acc, b) => acc + b.amountUSD,
        0,
      );
      const amountUSD = filteredBalances
        .filter((b) => selectedAddresses.includes(b.token.address))
        .reduce((acc, b) => acc + b.amountUSD, 0);

      return {
        amount: toRawAmount(toTokenStr(amountUSD), token.decimals).toString(),
        maxAmount: toRawAmount(
          toTokenStr(maxAmountUSD),
          token.decimals,
        ).toString(),
      };
    },
    [toAmountFromPrice, toInputAmount, toRawAmount, usdDecimals],
  );

  return useMemo(
    () => [
      defineNumericSelectField({
        fieldKey: 'amountThreshold',
        defaultValue: { value: INITIAL_THRESHOLD_USD },
        fieldProps: { values: [5, 10, 20, 30], label: 'Dust threshold' },
      }),

      defineChainSingleSelectField({
        fieldKey: 'chain',
        fieldProps: { availableChains: chains, label: 'Chain' },
        sidePanelProps: { availableChains: chains, header: 'Chains' },
        deriveProps: (getValue) => {
          const threshold = getValue('amountThreshold') as
            | NumericSelectValue
            | undefined;
          if (!threshold?.value) {
            return {};
          }

          const filteredChains = chains.filter((c) =>
            checkChainHasBalancesAboveThreshold(c.id, threshold.value),
          );
          return {
            fieldProps: { availableChains: filteredChains },
            sidePanelProps: { availableChains: filteredChains },
          };
        },
      }),

      defineBalancesMultiSelectField({
        fieldKey: 'balances',
        fieldProps: { availableBalances: nonNativeBalances, label: 'Convert' },
        sidePanelProps: {
          availableBalances: nonNativeBalances,
          header: 'Tokens',
        },
        deriveProps: (getValue) => {
          const threshold = getValue('amountThreshold') as
            | NumericSelectValue
            | undefined;
          const chain = getValue('chain') as ChainSingleSelectValue | undefined;

          if (!chain?.selectedChain || !threshold?.value) {
            return {
              fieldProps: { availableBalances: [] },
              sidePanelProps: { availableBalances: [] },
            };
          }

          const filteredBalances = nonNativeBalances.filter(
            (b) => b.token.chainId === chain.selectedChain,
          );
          return {
            fieldProps: { availableBalances: filteredBalances },
            sidePanelProps: { availableBalances: filteredBalances },
          };
        },
      }),

      defineDisplayAmountField({
        fieldKey: 'amount',
        fieldProps: {
          label: 'Amount',
          amount: '0',
          maxAmount: '0',
          token: fallbackNativeToken,
          enableSwapButton: false,
          primaryDisplay: 'amount',
        },
        deriveProps: (getValue) => {
          const threshold = getValue('amountThreshold') as
            | NumericSelectValue
            | undefined;
          const chain = getValue('chain') as ChainSingleSelectValue | undefined;
          const balances = getValue('balances') as
            | BalancesMultiSelectValue
            | undefined;

          if (!chain?.selectedChain || !threshold?.value) {
            return {};
          }

          const token =
            nativeExtendedTokens.find(
              (t) => t.chainId === chain.selectedChain,
            ) ?? fallbackNativeToken;

          const filteredBalances = getFilteredBalances(
            chain.selectedChain,
            threshold.value,
          );
          const { amount, maxAmount } = computeAmounts(
            filteredBalances,
            balances?.selectedAddresses ?? [],
            token,
          );

          return { fieldProps: { token, amount, maxAmount } };
        },
      }),
    ],
    [
      chains,
      nonNativeBalances,
      nativeExtendedTokens,
      fallbackNativeToken,
      checkChainHasBalancesAboveThreshold,
      getFilteredBalances,
      computeAmounts,
    ],
  );
};
