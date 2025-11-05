import { CategoryOption } from './MultiLayerDrawer.types';

export const chainOptions: CategoryOption[] = [
  { value: '1', label: 'Ethereum' },
  { value: '42161', label: 'Arbitrum' },
  { value: '137', label: 'Polygon' },
  { value: '10', label: 'Optimism' },
  { value: '56', label: 'BSC' },
  { value: '43114', label: 'Avalanche' },
];

export const protocolOptions: CategoryOption[] = [
  { value: 'aave', label: 'Aave' },
  { value: 'compound', label: 'Compound' },
  { value: 'lido', label: 'Lido' },
  { value: 'uniswap', label: 'Uniswap' },
  { value: 'curve', label: 'Curve' },
];

export const tagOptions: CategoryOption[] = [
  { value: 'stable', label: 'Stable Coin' },
  { value: 'liquid-staking', label: 'Liquid Staking' },
  { value: 'lending', label: 'Lending' },
  { value: 'farming', label: 'Yield Farming' },
  { value: 'single-asset', label: 'Single Asset' },
];

export const sortOptions: CategoryOption[] = [
  { value: 'apy-high', label: 'APY (Highest)' },
  { value: 'apy-low', label: 'APY (Lowest)' },
  { value: 'tvl-high', label: 'TVL (Highest)' },
  { value: 'tvl-low', label: 'TVL (Lowest)' },
];
