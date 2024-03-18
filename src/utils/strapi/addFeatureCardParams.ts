/**
 * Adds necessary params for Feature to an existing Strapi URL
 *
 * @param {string} apiUrl Strapi-URL
 * @returns {string} Strapi-Url modified with Feature params
 */

import { curry } from './curry';

interface AddFeatureCardParamsProps {
  apiUrl: URL;
}

export const addFeatureCardParams = curry(
  ({ apiUrl }: AddFeatureCardParamsProps) => {
    // populate images on feature card query
    apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
    apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
    apiUrl.searchParams.set('filters[PersonalizedFeatureCard][$nei]', 'true');
  },
);
