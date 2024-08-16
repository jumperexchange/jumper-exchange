import { siteName } from '@/app/lib/metadata';
import type { CoinbaseWalletParameters } from 'wagmi/connectors';

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: siteName,
  appLogoUrl: 'https://jumper.exchange/logo-144x144.svg',
};
