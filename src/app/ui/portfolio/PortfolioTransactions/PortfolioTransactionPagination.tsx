'use client';

import { CursorPagination } from '@/components/core/Pagination/CursorPagination';
import { useTransactionFiltering } from '@/providers/TransactionProvider/filtering/TransactionFilteringContext';

export const PortfolioTransactionPagination = () => {
  const {
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isLoading,
  } = useTransactionFiltering();

  if (!hasNextPage && !hasPreviousPage) {
    return null;
  }

  return (
    <CursorPagination
      hasPrevious={hasPreviousPage}
      hasNext={hasNextPage}
      onPrevious={goToPreviousPage}
      onNext={goToNextPage}
      disabled={isLoading}
      sx={{ marginTop: 0 }}
    />
  );
};
