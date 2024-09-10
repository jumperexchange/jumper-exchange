import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { StrapiMetaPagination } from '@/types/strapi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Typography, useTheme } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import {
  PaginationButton,
  PaginationContainer,
  PaginationIndexButton,
} from './Pagination.style';

interface BlogArticlesBoardPaginationProps {
  isEmpty: boolean;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pagination: StrapiMetaPagination;
  categoryId: number | undefined;
}

export const BlogArticlesBoardPagination = ({
  page,
  setPage,
  pagination,
  categoryId,
  isEmpty,
}: BlogArticlesBoardPaginationProps) => {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const handlePage = (page: number) => {
    trackEvent({
      category: TrackingCategory.BlogArticlesBoard,
      label: 'click-pagination',
      action: TrackingAction.ClickPagination,
      data: {
        [TrackingEventParameter.Pagination]: page,
        [TrackingEventParameter.PaginationCat]: categoryId || '',
      },
    });
    setPage(page);
  };

  const handleNext = () => {
    if (page + 1 < pagination.pageCount) {
      setPage((state) => state + 1);
    } else {
      setPage(0);
    }
    trackEvent({
      category: TrackingCategory.BlogArticlesBoard,
      label: 'click-pagination-next',
      action: TrackingAction.ClickPagination,
      data: {
        [TrackingEventParameter.Pagination]: page,
        [TrackingEventParameter.PaginationCat]: categoryId || '',
      },
    });
  };

  const handlePrev = () => {
    if (page === 0) {
      setPage(pagination.pageCount - 1);
    } else {
      setPage((state) => state - 1);
    }
    trackEvent({
      category: TrackingCategory.BlogArticlesBoard,
      label: 'click-pagination-prev',
      action: TrackingAction.ClickPagination,
      data: {
        [TrackingEventParameter.Pagination]: page,
        [TrackingEventParameter.PaginationCat]: categoryId || '',
      },
    });
  };

  return (
    !isEmpty && (
      <PaginationContainer>
        <PaginationButton onClick={() => handlePrev()} disableRipple={false}>
          <ArrowBackIcon
            sx={{
              color:
                page === 1
                  ? theme.palette.mode === 'light'
                    ? theme.palette.grey[400]
                    : theme.palette.grey[600]
                  : theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[400],
            }}
          />
        </PaginationButton>

        {Array.from({ length: pagination.pageCount }).map((_, index) => {
          const actualPage = index;
          return (
            <PaginationIndexButton
              key={`pagination-index-button-${index}`}
              onClick={() => handlePage(actualPage)}
              active={actualPage === page}
            >
              <Typography variant="bodySmallStrong" sx={{ lineHeight: '18px' }}>
                {actualPage + 1}
              </Typography>
            </PaginationIndexButton>
          );
        })}
        <PaginationButton onClick={() => handleNext()}>
          <ArrowForwardIcon
            sx={{
              color:
                pagination.pageCount === page
                  ? theme.palette.mode === 'light'
                    ? theme.palette.grey[400]
                    : theme.palette.grey[600]
                  : theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[400],
            }}
          />
        </PaginationButton>
      </PaginationContainer>
    )
  );
};
