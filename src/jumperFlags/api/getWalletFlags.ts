import 'server-only';

import type { StrapiResponse } from '@/types/strapi';
import type { WalletAccessControlData } from '@/types/walletAccessControl';
import { WalletAccessControlStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from '@/utils/strapi/strapiHelper';
import type { AccessStatus, JumperFlags } from '../types';
import { isWalletBlocked } from './getDenyList';

async function getWalletAccessControl(
  address: string,
): Promise<StrapiResponse<WalletAccessControlData>> {
  const urlParams = new WalletAccessControlStrapiApi().filterByAddress(address);

  const apiUrl = urlParams.getApiUrl();
  const accessToken = getStrapiApiAccessToken();

  const res = await fetch(decodeURIComponent(apiUrl), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch wallet access control data');
  }

  const data: StrapiResponse<WalletAccessControlData> = await res.json();
  return data;
}

export async function getWalletFlags(
  walletAddress: string,
): Promise<JumperFlags> {
  const [isBlocked, strapiData] = await Promise.all([
    isWalletBlocked(walletAddress),
    getWalletAccessControl(walletAddress),
  ]);

  const access: AccessStatus = isBlocked ? 'BLOCKED' : 'ALLOWED';

  const hasEarn = strapiData.data?.[0]?.hasEarn ?? false;

  return {
    access,
    hasEarn,
  };
}
