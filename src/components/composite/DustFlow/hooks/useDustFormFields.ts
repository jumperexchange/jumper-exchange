import { useCallback, useMemo } from 'react';
import {
  defineNumericSelectField,
  defineChainSingleSelectField,
  defineBalancesMultiSelectField,
  defineDisplayAmountField,
  defineComputedField,
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
import { type ExtendedChain } from '@lifi/sdk';
import { useTranslation } from 'react-i18next';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { INITIAL_MAX_THRESHOLD_USD, MAX_SELECTABLE_TOKENS } from '../constants';
import { useAccount } from '@lifi/wallet-management';
import { checkBalanceWithinRange, getChainMinUsdThreshold } from '../utils';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';

export interface DustSummaryValue {
  selectedBalances: PortfolioBalance<WalletToken>[];
  nativeToken: ExtendedToken;
  amount: string;
  amountUSD: number;
  address: string;
}

interface DustFieldDeriveResult {
  threshold: number | undefined;
  chainId: number | undefined;
  isValid: boolean;
}

const sortByAmountDesc = (
  a: PortfolioBalance<WalletToken>,
  b: PortfolioBalance<WalletToken>,
) => b.amountUSD - a.amountUSD;

const selectTopAddresses = (
  balances: PortfolioBalance<WalletToken>[],
): string[] =>
  [...balances]
    .sort(sortByAmountDesc)
    .slice(0, MAX_SELECTABLE_TOKENS)
    .map((b) => b.token.address);

const createDustFieldDerive = (
  getValue: (key: string) => unknown,
): DustFieldDeriveResult => {
  const threshold = getValue('amountThreshold') as
    | NumericSelectValue
    | undefined;
  const chain = getValue('chain') as ChainSingleSelectValue | undefined;

  return {
    threshold: threshold?.value,
    chainId: chain?.selectedChain,
    isValid: !!(threshold?.value != null && chain?.selectedChain != null),
  };
};

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

  const checkChainHasBalancesBelowThreshold = useCallback(
    (chainId: number, maxUsd: number): boolean =>
      nonNativeBalances
        .filter((b) => b.token.chainId === chainId)
        .some((b) =>
          checkBalanceWithinRange(b, maxUsd, getChainMinUsdThreshold(chainId)),
        ),
    [nonNativeBalances],
  );

  const getFilteredBalances = useCallback(
    (chainId: number, maxUsd: number) =>
      nonNativeBalances
        .filter((b) => b.token.chainId === chainId)
        .filter((b) =>
          checkBalanceWithinRange(b, maxUsd, getChainMinUsdThreshold(chainId)),
        ),
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
          toInputAmount(usd.toLocaleString('fullwide'), usdDecimals),
          token.priceUSD,
        );

      const maxAmountUSD = toAggregatedAmountUSD(filteredBalances);
      const amountUSD = toAggregatedAmountUSD(
        filteredBalances.filter((b) =>
          selectedAddresses.includes(b.token.address),
        ),
      );

      return {
        amount: toRawAmount(toTokenStr(amountUSD), token.decimals).toString(),
        maxAmount: toRawAmount(
          toTokenStr(maxAmountUSD),
          token.decimals,
        ).toString(),
      };
    },
    [
      toAmountFromPrice,
      toInputAmount,
      toRawAmount,
      toAggregatedAmountUSD,
      usdDecimals,
    ],
  );

  const defaultChainAndBalances = useMemo(() => {
    const chainBalanceSums = new Map<number, number>();
    const chainBalances = new Map<number, typeof nonNativeBalances>();

    let maxChainId: number | undefined;
    let maxSum = -Infinity;

    for (const balance of nonNativeBalances) {
      const { chainId } = balance.token;

      if (
        !checkBalanceWithinRange(
          balance,
          INITIAL_MAX_THRESHOLD_USD,
          getChainMinUsdThreshold(chainId),
        )
      ) {
        continue;
      }

      const newSum = (chainBalanceSums.get(chainId) ?? 0) + balance.amountUSD;
      chainBalanceSums.set(chainId, newSum);

      const list = chainBalances.get(chainId) ?? [];
      list.push(balance);
      chainBalances.set(chainId, list);

      if (newSum > maxSum) {
        maxSum = newSum;
        maxChainId = chainId;
      }
    }

    if (maxChainId == null) {
      return { chainId: undefined, addresses: [] };
    }

    return {
      chainId: maxChainId,
      addresses: selectTopAddresses(chainBalances.get(maxChainId) ?? []),
    };
  }, [nonNativeBalances]);

  const computeAccountAddress = useCallback(
    (chainId: number) => {
      const selectedChain = chains.find((c) => c.id === chainId);
      if (!selectedChain) {
        return undefined;
      }
      const account = accounts.find(
        (a) => a.chainType === selectedChain.chainType,
      );

      return account?.address;
    },
    [chains, accounts],
  );

  const computeDustSummary = useCallback(
    (getValue: (key: string) => unknown): DustSummaryValue | undefined => {
      const { threshold, chainId, isValid } = createDustFieldDerive(getValue);

      if (!isValid || threshold == null || chainId == null) {
        return undefined;
      }

      const address = computeAccountAddress(chainId);

      if (!address) {
        return undefined;
      }

      const balances = getValue('balances') as
        | BalancesMultiSelectValue
        | undefined;
      const selectedAddresses = balances?.selectedAddresses ?? [];

      const token =
        nativeExtendedTokens.find((t) => t.chainId === chainId) ??
        fallbackNativeToken;

      const filteredBalances = getFilteredBalances(chainId, threshold);
      const selectedBalances = filteredBalances.filter((b) =>
        selectedAddresses.includes(b.token.address),
      );
      const amountUSD = toAggregatedAmountUSD(selectedBalances);
      const { amount } = computeAmounts(
        filteredBalances,
        selectedAddresses,
        token,
      );

      const next: DustSummaryValue = {
        selectedBalances,
        nativeToken: token,
        amount,
        amountUSD,
        address,
      };

      const prev = getValue('dustSummary') as DustSummaryValue | undefined;
      if (
        prev &&
        prev.amount === next.amount &&
        prev.amountUSD === next.amountUSD &&
        prev.nativeToken.chainId === next.nativeToken.chainId &&
        prev.selectedBalances.length === next.selectedBalances.length &&
        prev.selectedBalances.every(
          (b, i) => b.token.address === next.selectedBalances[i].token.address,
        )
      ) {
        return prev;
      }
      return next;
    },
    [
      nativeExtendedTokens,
      fallbackNativeToken,
      getFilteredBalances,
      computeAccountAddress,
      computeAmounts,
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
        defaultValue:
          defaultChainAndBalances.chainId != null
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
          if (threshold == null) {
            return {};
          }
          const filteredChains = chains.filter((c) =>
            checkChainHasBalancesBelowThreshold(c.id, threshold),
          );

          const chainAmounts: Record<number, string> = {};
          let description: string | undefined;
          for (const chain of filteredChains) {
            const balances = getFilteredBalances(chain.id, threshold);
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
          if (!isValid || threshold == null || chainId == null) {
            return {
              fieldProps: { availableBalances: [] },
              sidePanelProps: { availableBalances: [] },
            };
          }
          const filteredBalances = getFilteredBalances(chainId, threshold);
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
        sanitizeOn: [
          {
            watchKey: 'chain',
            sanitize: ({ getValue }) => {
              const { threshold, chainId, isValid } =
                createDustFieldDerive(getValue);
              if (!isValid || threshold == null || chainId == null) {
                return undefined;
              }
              const addresses = selectTopAddresses(
                getFilteredBalances(chainId, threshold),
              );
              return addresses.length > 0
                ? { selectedAddresses: addresses }
                : undefined;
            },
          },
        ],
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
          if (!isValid || threshold == null || chainId == null) {
            return {};
          }

          const token =
            nativeExtendedTokens.find((t) => t.chainId === chainId) ??
            fallbackNativeToken;

          const filteredBalances = getFilteredBalances(chainId, threshold);
          const balances = getValue('balances') as
            | BalancesMultiSelectValue
            | undefined;

          const { amount, maxAmount } = computeAmounts(
            filteredBalances,
            balances?.selectedAddresses ?? [],
            token,
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
      checkChainHasBalancesBelowThreshold,
      getFilteredBalances,
      toDisplayAggregatedAmountUSD,
      toDisplayAmountUSD,
      computeAmounts,
      computeDustSummary,
      t,
    ],
  );
};
