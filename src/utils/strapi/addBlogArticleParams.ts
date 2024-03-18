/**
 * Adds necessary params for blog articles´ custom fields to an existing Strapi URL
 *
 * @param {string} apiUrl Strapi-URL
 * @returns {string} Strapi-Url with modified params to populate custom fields
 */

import { curry } from './curry';

interface AddBlogArticleParamsProps {
  apiUrl: URL;
}

export const addBlogArticleParams = curry(
  ({ apiUrl }: AddBlogArticleParamsProps) => {
    // populate images and relations (tags + faq)
    // ! needs to be -> contentType === STRAPI_BLOG_ARTICLES
    apiUrl.searchParams.set('populate[0]', 'Image');
    apiUrl.searchParams.set('populate[1]', 'tags');
    apiUrl.searchParams.set('populate[2]', 'author.Avatar');
    apiUrl.searchParams.set('populate[3]', 'faq_items');
    return apiUrl;
  },
);
