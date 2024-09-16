import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { StrapiMetaPagination } from '@/types/strapi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { darken, lighten, Typography, useTheme } from '@mui/material';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';

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
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pagination: StrapiMetaPagination;
  categoryId: number | undefined;
  id?: number | string;
}

export const Pagination = ({
  page,
  setPage,
  pagination,
  id,
  categoryId,
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
    <PaginationContainer>
      <SmoothScrollWrapper id={id}>
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
      </SmoothScrollWrapper>

      {Array.from({ length: pagination.pageCount }).map((_, index) => {
        const actualPage = index;
        return (
          <SmoothScrollWrapper id={id}>
            <PaginationIndexButton
              key={`pagination-index-button-${index}`}
              onClick={() => handlePage(actualPage)}
              active={actualPage === page}
            >
              <Typography variant="bodySmallStrong" sx={{ lineHeight: '18px' }}>
                {actualPage + 1}
              </Typography>
            </PaginationIndexButton>
          </SmoothScrollWrapper>
        );
      })}
      <SmoothScrollWrapper id={id}>
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
      </SmoothScrollWrapper>
    </PaginationContainer>
  );
};

// export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({

interface SmoothScrollWrapperProps {
  id?: number | string;
}

const SmoothScrollWrapper: React.FC<
  PropsWithChildren<SmoothScrollWrapperProps>
> = ({ children, id }) => {
  if (!id) {
    return children;
  }
  return <Link href={`#${id}`}>{children}</Link>;
};

export default Pagination;
