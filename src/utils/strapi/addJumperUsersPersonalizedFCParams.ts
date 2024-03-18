/**
 * Adds necessary params to an existing Strapi URL to fetch personalized Feature-Cards of a jumper-user
 *
 * @param {string} apiUrl Strapi-URL
 * @returns {string} Strapi-Url with modified params to populate personalized Feature-Cards of a jumper-user
 */

import type { Account } from '@/hooks/useAccounts';
import { curry } from './curry';

interface FilterPerrsonalFeatureCardsProps {
  enabled: boolean;
  account: Account | undefined;
}

interface AddJumperUsersPersonalizedFCParams {
  apiUrl: URL;
  filterPersonalFeatureCards: FilterPerrsonalFeatureCardsProps;
}

export const addJumperUsersPersonalizedFCParams = curry(
  ({
    apiUrl,
    filterPersonalFeatureCards,
  }: AddJumperUsersPersonalizedFCParams) => {
    if (
      filterPersonalFeatureCards.account?.address &&
      filterPersonalFeatureCards.account?.chainType === 'EVM'
    ) {
      apiUrl.searchParams.set(
        'filters[EvmWalletAddress][$eqi]',
        filterPersonalFeatureCards.account?.address,
      );
    }
    return apiUrl;
  },
);
