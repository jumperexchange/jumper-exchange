/**
 * Adds necessary params to an existing Strapi URL to add a relational FAQ items to blog articles
 *
 * @param {string} apiUrl Strapi-URL
 * @returns {string} Strapi-Url with modified params to populate relational faq item
 */

import { curry } from './curry';

interface AddFaqFeaturedFilterParamsProps {
  apiUrl: URL;
}

export const addFaqFeaturedFilterParams = curry(
  ({ apiUrl }: AddFaqFeaturedFilterParamsProps) => {
    apiUrl.searchParams.set('populate[0]', 'faqItems');
    return apiUrl;
  },
);
