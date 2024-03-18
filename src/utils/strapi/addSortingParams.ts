import { curry } from './curry';

interface AddSortingParamsProps {
  apiUrl: URL;
  sort: 'asc' | 'desc';
}

export const addSortingParams = curry(
  ({ apiUrl, sort }: AddSortingParamsProps) => {
    if (sort) {
      switch (sort) {
        case 'asc':
          apiUrl.searchParams.set('sort', 'createdAt:ASC');
          break;
        case 'desc':
          apiUrl.searchParams.set('sort', 'createdAt:DESC');
          break;
        default:
          return apiUrl;
      }
    }
    return apiUrl;
  },
);
