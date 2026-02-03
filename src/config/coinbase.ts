import { siteName } from '@/app/lib/metadata';
import { JUMPER_URL } from '@/const/urls';
import type { CoinbaseWalletParameters } from 'wagmi/connectors';

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: siteName,
  appLogoUrl: `${JUMPER_URL}/logo-144x144.svg`,
};
