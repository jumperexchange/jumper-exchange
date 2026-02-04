import { siteName } from '@/app/lib/metadata';
import type { MetaMaskParameters } from 'wagmi/connectors';
import config from '@/config/env-config';
import { JUMPER_URL } from '@/const/urls';

export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: siteName,
    url: config.NEXT_SITE_URL,
    iconUrl: `${JUMPER_URL}/logo-144x144.svg`,
  },
};
