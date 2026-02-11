import type { FC } from 'react';
import type { TokenAmountProps } from './types';
import { AggregatedTokenAmount } from './components/AggregatedTokenAmount';
import { SingleTokenAmount } from './components/SingleTokenAmount';

export const TokenAmount: FC<TokenAmountProps> = (props) => {
  return 'balances' in props ? (
    <AggregatedTokenAmount {...props} />
  ) : (
    <SingleTokenAmount {...props} />
  );
};
