import { useCallback, useMemo } from 'react';
import {
  defineNumericSelectField,
  defineChainSingleSelectField,
  defineBalancesMultiSelectField,
  defineDisplayAmountField,
  defineComputedField,
} from '@/components/composite/JumperWidget/utils';
import type { ExtendedToken } from '@/types/tokens';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import type { ExtendedChain } from '@lifi/sdk';
import { useTranslation } from 'react-i18next';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { INITIAL_MAX_THRESHOLD_USD, MAX_SELECTABLE_TOKENS } from '../constants';
import { useAccount } from '@jumperexchange/wallet-management';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { isNil } from '@/utils/isNil';
import {
  checkChainHasBalancesBelowThreshold,
  computeDustAmounts,
  createDustFieldDerive,
  dustSummaryContentEqual,
  getBalancesFieldValue,
  getDefaultChainAndBalances,
  getFilteredBalances,
  resolveAccountAddress,
  resolveNativeTokenForChain,
  sortByAmountDesc,
  sortChainsByFilteredDustUsdDesc,
  type DustAmountConverters,
} from '../utils';
import type { DustSummaryValue } from '../types';

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
  const { t } = useTranslation();
  const { accounts } = useAccount();
  const { toInputAmount, toAmountFromPrice, toRawAmount, usdDecimals } =
    useTokenAmountInput();
  const { toAggregatedAmountUSD, toDisplayAggregatedAmountUSD } =
    usePortfolioFormatters();
  const { toDisplayAmountUSD } = useTokenFormatters();

  const amountConverters: DustAmountConverters = {
    toAmountFromPrice,
    toInputAmount,
    toRawAmount,
    toAggregatedAmountUSD,
    usdDecimals,
  };

  const checkChainHasBalances = useCallback(
    (chainId: number, maxUsd: number): boolean =>
      checkChainHasBalancesBelowThreshold(nonNativeBalances, chainId, maxUsd),
    [nonNativeBalances],
  );

  const getFiltered = useCallback(
    (chainId: number, maxUsd: number) =>
      getFilteredBalances(nonNativeBalances, chainId, maxUsd),
    [nonNativeBalances],
  );

  const defaultChainAndBalances = useMemo(
    () => getDefaultChainAndBalances(nonNativeBalances),
    [nonNativeBalances],
  );

  const computeDustSummary = useCallback(
    (getValue: (key: string) => unknown): DustSummaryValue | undefined => {
      const { threshold, chainId, isValid } = createDustFieldDerive(getValue);

      if (!isValid || isNil(threshold) || isNil(chainId)) {
        return undefined;
      }

      const address = resolveAccountAddress(chainId, chains, accounts);

      if (!address) {
        return undefined;
      }

      const balances = getBalancesFieldValue(getValue);
      const selectedAddresses = balances?.selectedAddresses ?? [];

      const token = resolveNativeTokenForChain(
        chainId,
        nativeExtendedTokens,
        fallbackNativeToken,
      );

      const filteredBalances = getFiltered(chainId, threshold);
      const selectedBalances = filteredBalances.filter((b) =>
        selectedAddresses.includes(b.token.address),
      );
      const amountUSD = toAggregatedAmountUSD(selectedBalances);
      const { amount } = computeDustAmounts(
        filteredBalances,
        selectedAddresses,
        token,
        amountConverters,
      );

      const next: DustSummaryValue = {
        selectedBalances,
        nativeToken: token,
        amount,
        amountUSD,
        address,
      };

      const prev = getValue('dustSummary') as DustSummaryValue | undefined;
      if (prev && dustSummaryContentEqual(prev, next)) {
        return prev;
      }
      return next;
    },
    [
      nativeExtendedTokens,
      fallbackNativeToken,
      getFiltered,
      chains,
      accounts,
      amountConverters,
      toAggregatedAmountUSD,
    ],
  );

  return useMemo(
    () => [
      defineNumericSelectField({
        t,
        fieldKey: 'amountThreshold',
        defaultValue: { value: INITIAL_MAX_THRESHOLD_USD },
        fieldProps: {
          values: [5, 10, 20, 30],
          label: t('form.labels.dustThreshold'),
        },
      }),

      defineChainSingleSelectField({
        t,
        fieldKey: 'chain',
        defaultValue: !isNil(defaultChainAndBalances.chainId)
          ? { selectedChain: defaultChainAndBalances.chainId }
          : undefined,
        fieldProps: {
          availableChains: chains,
          label: t('form.labels.chain'),
        },
        sidePanelProps: {
          availableChains: chains,
          header: t('headers.chains'),
        },
        deriveProps: (getValue) => {
          const { threshold, chainId } = createDustFieldDerive(getValue);
          if (isNil(threshold)) {
            return {};
          }
          const filteredChains = sortChainsByFilteredDustUsdDesc(
            chains.filter((c) => checkChainHasBalances(c.id, threshold)),
            nonNativeBalances,
            threshold,
          );

          const chainAmounts: Record<number, string> = {};
          let description: string | undefined;
          for (const chain of filteredChains) {
            const balances = getFiltered(chain.id, threshold);
            if (balances.length === 0) {
              continue;
            }
            chainAmounts[chain.id] = toDisplayAggregatedAmountUSD(balances);
            if (chain.id === chainId) {
              description = t('form.descriptions.chainAvailable', {
                count: balances.length,
                amount: chainAmounts[chain.id],
              });
            }
          }

          return {
            fieldProps: { availableChains: filteredChains, description },
            sidePanelProps: { availableChains: filteredChains, chainAmounts },
          };
        },
      }),

      defineBalancesMultiSelectField({
        t,
        fieldKey: 'balances',
        defaultValue:
          defaultChainAndBalances.addresses.length > 0
            ? { selectedAddresses: defaultChainAndBalances.addresses }
            : undefined,
        fieldProps: {
          availableBalances: [...nonNativeBalances].sort(sortByAmountDesc),
          label: t('form.labels.convert'),
        },
        sidePanelProps: {
          availableBalances: [...nonNativeBalances].sort(sortByAmountDesc),
          header: t('headers.tokens'),
        },
        schemaOptions: {
          max: MAX_SELECTABLE_TOKENS,
        },
        deriveProps: (getValue) => {
          const { threshold, chainId, isValid } =
            createDustFieldDerive(getValue);
          if (!isValid || isNil(threshold) || isNil(chainId)) {
            return {
              fieldProps: { availableBalances: [] },
              sidePanelProps: { availableBalances: [] },
            };
          }
          const filteredBalances = getFiltered(chainId, threshold);
          const balanceAmounts: Record<string, string> = {};
          for (const balance of filteredBalances) {
            balanceAmounts[balance.token.address] = toDisplayAmountUSD(balance);
          }
          return {
            fieldProps: { availableBalances: filteredBalances },
            sidePanelProps: {
              availableBalances: filteredBalances,
              balanceAmounts,
            },
          };
        },
      }),

      defineDisplayAmountField({
        fieldKey: 'amount',
        fieldProps: {
          label: t('form.labels.amount'),
          amount: '0',
          maxAmount: '0',
          token: fallbackNativeToken,
          enableSwapButton: false,
          enableMaxIndicator: false,
          primaryDisplay: 'amount',
        },
        deriveProps: (getValue) => {
          const { threshold, chainId, isValid } =
            createDustFieldDerive(getValue);
          if (!isValid || isNil(threshold) || isNil(chainId)) {
            return {};
          }

          const token = resolveNativeTokenForChain(
            chainId,
            nativeExtendedTokens,
            fallbackNativeToken,
          );

          const filteredBalances = getFiltered(chainId, threshold);
          const balances = getBalancesFieldValue(getValue);

          const { amount, maxAmount } = computeDustAmounts(
            filteredBalances,
            balances?.selectedAddresses ?? [],
            token,
            amountConverters,
          );

          return { fieldProps: { token, amount, maxAmount } };
        },
      }),

      defineComputedField<DustSummaryValue | undefined>({
        fieldKey: 'dustSummary',
        dependencies: ['amountThreshold', 'chain', 'balances'],
        compute: computeDustSummary,
      }),
    ],
    [
      chains,
      nonNativeBalances,
      nativeExtendedTokens,
      fallbackNativeToken,
      defaultChainAndBalances,
      checkChainHasBalances,
      getFiltered,
      toDisplayAggregatedAmountUSD,
      toDisplayAmountUSD,
      amountConverters,
      computeDustSummary,
      t,
    ],
  );
};
