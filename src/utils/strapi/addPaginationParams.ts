/**
 * Adds necessary params for pagination to an existing Strapi URL
 *
 * @param {string} apiUrl Strapi-URL
 * @param {object} pagination Object containing page (number), pageSize (number) and withCount (boolean)
 * @returns {string} Strapi-Url modified with pagination params
 */

import { curry } from './curry';

interface PaginationProps {
  page: number;
  pageSize: number;
  withCount?: boolean;
}

interface AddPaginationParamsProps {
  apiUrl: URL;
  pagination: PaginationProps;
}

export const addPaginationParams = curry(
  ({ apiUrl, pagination }: AddPaginationParamsProps) => {
    apiUrl.searchParams.set('pagination[page]', `${pagination.page}`);
    apiUrl.searchParams.set('pagination[pageSize]', `${pagination.pageSize}`);
    apiUrl.searchParams.set(
      'pagination[withCount]',
      pagination.withCount === false ? 'false' : 'true',
    );
  },
);
