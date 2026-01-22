import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import type { Account } from '@lifi/wallet-management';

export type PortfolioPositionsQueryWithoutEvm = Omit<
  PortfolioPositionsQuery,
  'evm'
>;

export type PortfolioAccount = Omit<Account, 'address'> & {
  address: string;
};
