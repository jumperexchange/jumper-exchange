import { SortByEnum, SortByOptions } from 'src/app/ui/earn/types';
import { TokenStack } from '../TokenStack/TokenStack';
import { CategoryOption } from './MultiLayerDrawer.types';

export const chainOptions: CategoryOption<string>[] = [
  { value: '1', label: 'Ethereum' },
  { value: '42161', label: 'Arbitrum' },
  { value: '137', label: 'Polygon' },
  { value: '10', label: 'Optimism' },
  { value: '56', label: 'BSC' },
  { value: '43114', label: 'Avalanche' },
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

export const sortOptions: CategoryOption<SortByEnum>[] = [
  { value: SortByOptions.APY, label: 'APY' },
  { value: SortByOptions.TVL, label: 'TVL' },
];
