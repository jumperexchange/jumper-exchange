/**
 * Adds necessary params to an existing Strapi URL to fetch jumper users including custom fields
 *
 * @param {string} apiUrl Strapi-URL
 * @returns {string} Strapi-Url with modified params to populate jumper-users
 */

import { curry } from './curry';

interface AddJumperUsersParamsProps {
  apiUrl: URL;
}

export const addJumperUsersParams = curry(
  ({ apiUrl }: AddJumperUsersParamsProps) => {
    apiUrl.searchParams.set('populate[0]', 'feature_cards');
    apiUrl.searchParams.set(
      'populate[feature_cards][populate][0]',
      'BackgroundImageLight',
    );
    apiUrl.searchParams.set(
      'populate[feature_cards][populate][1]',
      'BackgroundImageDark',
    );
    return apiUrl;
  },
);
