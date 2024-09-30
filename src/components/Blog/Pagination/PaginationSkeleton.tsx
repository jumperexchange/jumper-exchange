import { Skeleton } from '@mui/material';

import { PaginationContainer } from './Pagination.style';

export const BlogArticlesBoardPaginationSkeleton = () => {
  return (
    <PaginationContainer>
      {Array.from({ length: 4 }).map((_, index) => {
        return (
          <Skeleton
            variant="circular"
            width="40"
            height="40"
            key={`pagination-skeleton-${index}`}
          />
        );
      })}
    </PaginationContainer>
  );
};
