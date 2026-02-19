import { createTokenBalance } from '@/types/tokens';
import type { FC } from 'react';
import { useWidgetStore } from '../../JumperWidget/store';
import type { BalancesMultiSelectValue } from '../../JumperWidget/components/Balances';
import type { ChainSingleSelectValue } from '../../JumperWidget/components/Chain';
import { useDustBalances } from '../hooks/useDustBalances';
import { useFallbackNativeToken } from '../hooks/useFallbackNativeToken';
import { Summary } from '../../JumperWidget/components/Summary';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';

export const RouteOverview: FC = () => {
  const { nativeExtendedTokens, nonNativeBalances } = useDustBalances();
  const fallbackNativeToken = useFallbackNativeToken(nativeExtendedTokens);
  const { toInputAmount, toAmountFromPrice, toRawAmount, usdDecimals } =
    useTokenAmountInput();

  const values = useWidgetStore((state) => state.values);
  const chain = values.chain as ChainSingleSelectValue | undefined;
  const balances = values.balances as BalancesMultiSelectValue | undefined;
  const selectedAddresses = balances?.selectedAddresses ?? [];

  const token =
    nativeExtendedTokens.find((t) => t.chainId === chain?.selectedChain) ??
    fallbackNativeToken;

  const filteredBalances = nonNativeBalances.filter((b) =>
    selectedAddresses.includes(b.token.address),
  );

  const amountUSD = filteredBalances.reduce((acc, b) => acc + b.amountUSD, 0);
  const amount = toRawAmount(
    toAmountFromPrice(
      toInputAmount(amountUSD.toString(), usdDecimals),
      token.priceUSD,
    ),
    token.decimals,
  ).toString();

  return (
    <Summary
      label="Convert"
      from={filteredBalances}
      amountUSD={amountUSD}
      to={createTokenBalance(token, amount)}
      fieldSx={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
    />
  );
};
