import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { StrapiMetaPagination } from '@/types/strapi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { darken, lighten, Typography, useTheme } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import Link from 'next/link';
import {
  PaginationButton,
  PaginationContainer,
  PaginationIndexButton,
} from './Pagination.style';

interface PaginationProps {
  isEmpty: boolean;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pagination: StrapiMetaPagination;
  categoryId: number | undefined;
  id?: number;
}

export const Pagination = ({
  page,
  setPage,
  pagination,
  id,
  categoryId,
  isEmpty,
}: PaginationProps) => {
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
        <Link href={`#${id}`}>
          <PaginationButton onClick={() => handlePrev()} disableRipple={false}>
            <ArrowBackIcon
              sx={{
                color:
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.text.primary, 0.6)
                    : darken(theme.palette.text.primary, 0.2),
              }}
            />
          </PaginationButton>
        </Link>

        {Array.from({ length: pagination.pageCount }).map((_, index) => {
          const actualPage = index;
          return (
            <Link href={`#${id}`}>
              <PaginationIndexButton
                key={`pagination-index-button-${index}`}
                onClick={() => handlePage(actualPage)}
                active={actualPage === page}
              >
                <Typography
                  variant="bodySmallStrong"
                  sx={{ lineHeight: '18px' }}
                >
                  {actualPage + 1}
                </Typography>
              </PaginationIndexButton>
            </Link>
          );
        })}
        <Link href={`#${id}`}>
          <PaginationButton onClick={() => handleNext()}>
            <ArrowForwardIcon
              sx={{
                color:
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.text.primary, 0.6)
                    : darken(theme.palette.text.primary, 0.2),
              }}
            />
          </PaginationButton>
        </Link>
      </PaginationContainer>
    )
  );
};
