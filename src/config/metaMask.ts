import { siteName } from '@/app/lib/metadata';
import type { MetaMaskParameters } from 'wagmi/connectors';

export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: siteName,
    url:
      typeof window !== 'undefined'
        ? (window as any)?.location.href
        : 'https://jumper.exchange',
    iconUrl: 'https://jumper.exchange/logo-144x144.svg',
  },
};
