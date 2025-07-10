import { siteName } from '@/app/lib/metadata';
import type { MetaMaskParameters } from 'wagmi/connectors';
import config from '@/config/env-config';

export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: siteName,
    url: config.NEXT_SITE_URL,
    iconUrl: 'https://jumper.exchange/logo-144x144.svg',
  },
};
