import {
  type SortByEnum as EarnSortByEnum,
  SortByOptions as EarnSortByOptions,
} from 'src/app/ui/earn/types';
import {
  type SortByEnum as LearnSortByEnum,
  SortByOptions as LearnSortByOptions,
} from 'src/providers/LearnProvider/filtering/types';
import { TokenStack } from '../TokenStack/TokenStack';
import type { CategoryOption } from './MultiLayer.types';
import { addDays, subDays } from 'date-fns';

export const chainOptions: CategoryOption<string>[] = [
  { value: '1', label: 'Ethereum' },
  { value: '42161', label: 'Arbitrum' },
  { value: '137', label: 'Polygon' },
  { value: '10', label: 'Optimism' },
  { value: '56', label: 'BSC' },
  { value: '43114', label: 'Avalanche' },
  { value: '8453', label: 'Base' },
  { value: '250', label: 'Fantom' },
  { value: '1101', label: 'Polygon zkEVM' },
  { value: '324', label: 'zkSync Era' },
  { value: '59144', label: 'Linea' },
  { value: '534352', label: 'Scroll' },
  { value: '100', label: 'Gnosis' },
  { value: '1284', label: 'Moonbeam' },
  { value: '42220', label: 'Celo' },
  { value: '25', label: 'Cronos' },
];

export const protocolOptions: CategoryOption<string>[] = [
  { value: 'aave', label: 'Aave' },
  { value: 'compound', label: 'Compound' },
  { value: 'lido', label: 'Lido' },
  { value: 'uniswap', label: 'Uniswap' },
  { value: 'curve', label: 'Curve' },
];

export const tagOptions: CategoryOption<string>[] = [
  { value: 'stable', label: 'Stable Coin' },
  { value: 'liquid-staking', label: 'Liquid Staking' },
  { value: 'lending', label: 'Lending' },
  { value: 'farming', label: 'Yield Farming' },
  { value: 'single-asset', label: 'Single Asset' },
];

export const assetOptions: CategoryOption<string>[] = [
  {
    value: 'usdc',
    label: 'USDC',
    icon: (
      <TokenStack
        tokens={[
          {
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            chain: { chainId: 1, chainKey: 'ethereum' },
          },
        ]}
      />
    ),
  },
  {
    value: 'usdt',
    label: 'USDT',
    icon: (
      <TokenStack
        tokens={[
          {
            address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
            chain: { chainId: 10, chainKey: 'BNB Chain' },
          },
        ]}
      />
    ),
  },
  {
    value: 'dai',
    label: 'DAI',
    icon: (
      <TokenStack
        tokens={[
          {
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            chain: { chainId: 1, chainKey: 'Ethereum' },
          },
        ]}
      />
    ),
  },
];

export const sortOptions: CategoryOption<EarnSortByEnum>[] = [
  { value: EarnSortByOptions.APY, label: 'APY' },
  { value: EarnSortByOptions.TVL, label: 'TVL' },
];

export const blogArticlesTagOptions: CategoryOption<string>[] = [
  { value: 'all', label: 'All' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'bridge', label: 'Bridge' },
  { value: 'knowledge', label: 'Knowledge' },
  { value: 'partnerships', label: 'Partnerships' },
  { value: 'tutorial', label: 'Tutorial' },
];

export const blogArticlesLevelOptions: CategoryOption<string>[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
];

export const blogArticlesSortOptions: CategoryOption<LearnSortByEnum>[] = [
  { value: LearnSortByOptions.READING_TIME, label: 'Reading time' },
  { value: LearnSortByOptions.LEVEL, label: 'Level' },
  { value: LearnSortByOptions.DATE, label: 'Publish date' },
];

export const blogArticlesDateRange = {
  min: subDays(Date.now(), 45),
  max: addDays(Date.now(), 5),
};
