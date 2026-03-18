import {
  Pagination,
  PaginationVariant,
} from '@/components/core/Pagination/Pagination';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useCallback } from 'react';
import { useLearnFiltering } from '../../../../providers/LearnProvider/filtering/LearnFilteringContext';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';

export const LearnPageArticlesPagination = () => {
  const { page, pagination, setPage, tab, tabs } = useLearnFiltering();
  const { trackEvent } = useUserTracking();
  const trackPagination = useCallback(
    (label: string, page: number) => {
      if (!tab) {
        return null;
      }

      const _index = tabs?.findIndex((_tab) => _tab === tab) ?? -1;

      trackEvent({
        category: TrackingCategory.BlogArticlesBoard,
        label,
        action: TrackingAction.ClickPagination,
        data: {
          [TrackingEventParameter.Pagination]: page,
          [TrackingEventParameter.PaginationCat]:
            _index === -1 ? 0 : _index + 1,
        },
      });
    },
    [tab, tabs, trackEvent],
  );

  const handleSetPage = useCallback(
    (page: number) => {
      trackPagination('click-pagination', page);
    },
    [trackPagination],
  );

  const handlePrev = useCallback(() => {
    trackPagination('click-pagination-prev', page - 1);
  }, [trackPagination, page]);

  const handleNext = useCallback(() => {
    trackPagination('click-pagination-next', page + 1);
  }, [trackPagination, page]);

  return pagination.pageCount > 1 ? (
    <Pagination
      variant={PaginationVariant.WindowedPages}
      maxVisiblePages={3}
      page={page}
      setPage={setPage}
      pagination={pagination}
      onPrev={handlePrev}
      onNext={handleNext}
      onSetPage={handleSetPage}
      sx={{ width: '100%' }}
    />
  ) : null;
};
