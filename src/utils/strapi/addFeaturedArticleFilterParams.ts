import { curry } from './curry';

interface AddFeaturedArticleFilterParams {
  apiUrl: URL;
}

export const addFeaturedArticleFilterParams = curry(
  ({ apiUrl }: AddFeaturedArticleFilterParams) => {
    // filter articles by "featured" boolean flag
    apiUrl.searchParams.set('filters[featured][$eq]', 'true');
    return apiUrl;
  },
);
