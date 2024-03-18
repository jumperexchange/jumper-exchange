/**
 * Adds necessary params to an existing Strapi URL to filter blog articles´ by custom fields
 *
 * @param {string} apiUrl Strapi-URL
 * @param {string} apiUrl Strapi-URL
 * @returns {string} Strapi-Url with modified params to populate custom fields
 */

import { curry } from './curry';

interface AddBlogArticleSlugFilterParamsProps {
  apiUrl: URL;
  filterSlug: string;
}

export const addBlogArticleSlugFilterParams = curry(
  ({ apiUrl, filterSlug }: AddBlogArticleSlugFilterParamsProps) => {
    apiUrl.searchParams.set('filters[Slug][$eq]', filterSlug);
    return apiUrl;
  },
);
