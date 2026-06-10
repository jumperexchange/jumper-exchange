import type { StrapiResponse } from '@/types/strapi';
import type { WalletAccessControlData } from '@/types/walletAccessControl';
import { WalletAccessControlStrapiApi } from '@/utils/strapi/StrapiApi';
export async function getWalletAccessControl(
  address: string,
): Promise<StrapiResponse<WalletAccessControlData>> {
  const urlParams = new WalletAccessControlStrapiApi().filterByAddress(address);

  const apiUrl = urlParams.getApiUrl();

  const res = await fetch(decodeURIComponent(apiUrl));

  if (!res.ok) {
    throw new Error('Failed to fetch wallet access control data');
  }

  const data: StrapiResponse<WalletAccessControlData> = await res.json();
  return data;
}
