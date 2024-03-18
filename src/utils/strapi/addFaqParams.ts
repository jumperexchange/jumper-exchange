/**
 * Adds necessary params to an existing Strapi URL to fetch a relational FAQ item to blog articles
 *
 * @param {string} apiUrl Strapi-URL
 * @returns {string} Strapi-Url with modified params to populate relational faq item
 */

import { curry } from './curry';

interface AddFaqParamsProps {
  apiUrl: URL;
}

export const addFaqParams = curry(({ apiUrl }: AddFaqParamsProps) => {
  apiUrl.searchParams.set('populate[0]', 'faqItems');
  return apiUrl;
});
