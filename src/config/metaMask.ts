import { siteName } from '@/app/lib/metadata';
import type { MetaMaskParameters } from 'wagmi/connectors';

export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: siteName,
    url: process.env.NEXT_SITE_URL,
    iconUrl: 'https://jumper.exchange/logo-144x144.svg',
  },
};
