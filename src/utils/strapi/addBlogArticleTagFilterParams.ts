/**
 * Adds necessary params to an existing Strapi URL to filter blog articles´ by custom fields
 *
 * @param {string} apiUrl Strapi-URL
 * @param {string} apiUrl Strapi-URL
 * @returns {string} Strapi-Url with modified params to populate custom fields
 */

import { curry } from './curry';

interface AddBlogArticleTagFilterParamsProps {
  apiUrl: URL;
  filterTag: string | string[];
}

export const addBlogArticleSlugFilterParams = curry(
  ({ apiUrl, filterTag }: AddBlogArticleTagFilterParamsProps) => {
    if (typeof filterTag === 'string') {
      apiUrl.searchParams.set('filters[tags][id][$eq]', `${filterTag}`);
    } else if (Array.isArray(filterTag)) {
      filterTag.forEach((el, index) => {
        apiUrl.searchParams.set(
          `filters[$and][0][$or][${index}][tags][id][$eq]`,
          `${el}`,
        );
      });
    }
    return apiUrl;
  },
);
