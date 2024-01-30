import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Skeleton, Typography, useTheme } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import type { StrapiMeta } from 'src/types';
import { EventTrackingTool } from 'src/types';
import {
  PaginationButton,
  PaginationContainer,
  PaginationIndexButton,
} from './Pagination.style';

interface BlogArticlesBoardPaginationProps {
  isSuccess: boolean;
  isEmpty: boolean;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  meta: StrapiMeta;
  catId: number | undefined;
}

export const BlogArticlesBoardPagination = ({
  isSuccess,
  page,
  setPage,
  meta,
  catId,
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
        [TrackingEventParameter.PaginationCat]: catId,
      },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    setPage(page);
  };

  const handleNext = () => {
    if (page < meta.pagination.pageCount) {
      setPage((state) => state + 1);
    } else {
      setPage(1);
    }
    trackEvent({
      category: TrackingCategory.BlogArticlesBoard,
      label: 'click-pagination-next',
      action: TrackingAction.ClickPagination,
      data: {
        [TrackingEventParameter.Pagination]: page,
        [TrackingEventParameter.PaginationCat]: catId,
      },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((state) => state - 1);
    } else {
      setPage(meta.pagination.pageCount);
    }
    trackEvent({
      category: TrackingCategory.BlogArticlesBoard,
      label: 'click-pagination-prev',
      action: TrackingAction.ClickPagination,
      data: {
        [TrackingEventParameter.Pagination]: page,
        [TrackingEventParameter.PaginationCat]: catId,
      },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
  };

  return isSuccess ? (
    !isEmpty && (
      <PaginationContainer>
        <PaginationButton onClick={() => handlePrev()} disableRipple={false}>
          <ArrowBackIosIcon
            sx={{
              marginLeft: theme.spacing(0.75),
            }}
          />
        </PaginationButton>

        {Array.from({ length: meta?.pagination.pageCount }).map((_, index) => {
          const actualPage = index + 1;
          return (
            <PaginationIndexButton
              key={`pagination-index-button-${index}`}
              onClick={() => handlePage(actualPage)}
              active={actualPage === page}
            >
              <Typography variant="lifiBodyMedium">{actualPage}</Typography>
            </PaginationIndexButton>
          );
        })}
        <PaginationButton onClick={() => handleNext()}>
          <ArrowForwardIosIcon
            sx={{
              marginLeft: theme.spacing(0.25),
            }}
          />
        </PaginationButton>
      </PaginationContainer>
    )
  ) : (
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
