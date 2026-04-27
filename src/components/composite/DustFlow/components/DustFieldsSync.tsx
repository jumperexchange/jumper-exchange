import { useLayoutEffect, useRef, type FC } from 'react';
import { useStore } from '@tanstack/react-form';
import { useFormContext } from '@/components/composite/JumperWidget/context';
import type { ExtendedChain } from '@lifi/sdk';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { isNil } from '@/utils/isNil';
import {
  checkChainHasBalancesBelowThreshold,
  getFilteredBalances,
  selectTopAddresses,
  sortChainsByFilteredDustUsdDesc,
} from '../utils';
import type { NumericSelectValue } from '@/components/composite/JumperWidget/components/NumericSelect';
import type { ChainSingleSelectValue } from '@/components/composite/JumperWidget/components/Chain';

type DustFieldsSyncProps = {
  chains: ExtendedChain[];
  nonNativeBalances: PortfolioBalance<WalletToken>[];
};

export const DustFieldsSync: FC<DustFieldsSyncProps> = ({
  chains,
  nonNativeBalances,
}) => {
  const form = useFormContext();
  const threshold = useStore(
    form.store,
    (s) => s.values.amountThreshold as NumericSelectValue | undefined,
  )?.value;
  const chain = useStore(
    form.store,
    (s) => s.values.chain as ChainSingleSelectValue | undefined,
  );
  const prevThreshold = useRef<number | 'init'>('init');
  const prevChainId = useRef<number | 'init'>('init');

  useLayoutEffect(() => {
    if (isNil(threshold)) {
      return;
    }
    if (prevThreshold.current === 'init') {
      prevThreshold.current = threshold;
      return;
    }
    if (prevThreshold.current === threshold) {
      return;
    }
    prevThreshold.current = threshold;

    const sorted = sortChainsByFilteredDustUsdDesc(
      chains.filter((c) =>
        checkChainHasBalancesBelowThreshold(nonNativeBalances, c.id, threshold),
      ),
      nonNativeBalances,
      threshold,
    );
    const topId = sorted[0]?.id;
    if (isNil(topId)) {
      return;
    }

    const current = form.getFieldValue('chain') as
      | ChainSingleSelectValue
      | undefined;
    if (current?.selectedChain === topId) {
      return;
    }

    void form.setFieldValue('chain', { selectedChain: topId });
  }, [threshold, chains, nonNativeBalances, form]);

  useLayoutEffect(() => {
    const chainId = chain?.selectedChain;
    if (isNil(chainId) || isNil(threshold)) {
      return;
    }
    if (prevChainId.current === 'init') {
      prevChainId.current = chainId;
      return;
    }
    prevChainId.current = chainId;
    const addresses = selectTopAddresses(
      getFilteredBalances(nonNativeBalances, chainId, threshold),
    );
    void form.setFieldValue('balances', { selectedAddresses: addresses });
  }, [chain, threshold, nonNativeBalances, form]);

  return null;
};
