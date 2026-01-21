import type { Account } from '@lifi/wallet-management';
import type { PortfolioTokenGroup } from './PortfolioTokenGroup';

export type PortfolioAccount = Omit<Account, 'address'> & { address: string };

export type { PortfolioTokenGroup };
