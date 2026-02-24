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
import { ChainId, type ExtendedChain } from '@lifi/sdk';
import { useTranslation } from 'react-i18next';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { INITIAL_MAX_THRESHOLD_USD } from '../constants';

const getChainMinUsdThreshold = (chainId: number) => {
  if (chainId === ChainId.ETH) {
    return 0.5;
  }
  return 0.05;
};

const checkBalanceWithinRange = (
  balance: PortfolioBalance<WalletToken>,
  maxUsd: number,
  minUsd: number,
): boolean => maxUsd >= balance.amountUSD && balance.amountUSD > minUsd;

export interface DustSummaryValue {
  selectedBalances: PortfolioBalance<WalletToken>[];
  nativeToken: ExtendedToken;
  amount: string;
  amountUSD: number;
}

interface DustFieldDeriveResult {
  threshold: number | undefined;
  chainId: number | undefined;
  isValid: boolean;
}

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
  const { toInputAmount, toAmountFromPrice, toRawAmount, usdDecimals } =
    useTokenAmountInput();
  const { toAggregatedAmountUSD } = usePortfolioFormatters();

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

  const computeDustSummary = useCallback(
    (getValue: (key: string) => unknown): DustSummaryValue | undefined => {
      const { threshold, chainId, isValid } = createDustFieldDerive(getValue);
      if (!isValid || threshold == null || chainId == null) {
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
      const amountUSD = selectedBalances.reduce(
        (acc, b) => acc + b.amountUSD,
        0,
      );

      const toTokenStr = (usd: number) =>
        toAmountFromPrice(
          toInputAmount(usd.toString(), usdDecimals),
          token.priceUSD,
        );
      const amount = toRawAmount(
        toTokenStr(amountUSD),
        token.decimals,
      ).toString();

      const next: DustSummaryValue = {
        selectedBalances,
        nativeToken: token,
        amount,
        amountUSD,
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
      toAmountFromPrice,
      toInputAmount,
      toRawAmount,
      usdDecimals,
    ],
  );

  return useMemo(
    () => [
      defineNumericSelectField({
        fieldKey: 'amountThreshold',
        defaultValue: { value: INITIAL_MAX_THRESHOLD_USD },
        fieldProps: {
          values: [5, 10, 20, 30],
          label: t('form.labels.dustThreshold'),
        },
      }),

      defineChainSingleSelectField({
        fieldKey: 'chain',
        fieldProps: { availableChains: chains, label: t('form.labels.chain') },
        sidePanelProps: {
          availableChains: chains,
          header: t('headers.chains'),
        },
        deriveProps: (getValue) => {
          const { threshold } = createDustFieldDerive(getValue);
          if (threshold == null) {
            return {};
          }
          const filteredChains = chains.filter((c) =>
            checkChainHasBalancesBelowThreshold(c.id, threshold),
          );
          return {
            fieldProps: { availableChains: filteredChains },
            sidePanelProps: { availableChains: filteredChains },
          };
        },
      }),

      defineBalancesMultiSelectField({
        fieldKey: 'balances',
        fieldProps: {
          availableBalances: nonNativeBalances,
          label: t('form.labels.convert'),
        },
        sidePanelProps: {
          availableBalances: nonNativeBalances,
          header: t('headers.tokens'),
        },
        schemaOptions: {
          max: 10,
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
          return {
            fieldProps: { availableBalances: filteredBalances },
            sidePanelProps: { availableBalances: filteredBalances },
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
      checkChainHasBalancesBelowThreshold,
      getFilteredBalances,
      computeAmounts,
      computeDustSummary,
      t,
    ],
  );
};
