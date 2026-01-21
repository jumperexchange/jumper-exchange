import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { darken, lighten, Typography } from '@mui/material';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

import type { StrapiMetaPagination } from '@/types/strapi';

import {
  PaginationButton,
  PaginationContainer,
  PaginationIndexButton,
} from './Pagination.style';

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  pagination: StrapiMetaPagination;
  id?: number | string;
  onPrev?: () => void;
  onNext?: () => void;
  onSetPage?: (page: number) => void;
}

export const Pagination = ({
  page,
  setPage,
  pagination,
  id,
  onPrev,
  onNext,
  onSetPage,
}: PaginationProps) => {
  const isFirstPage = page === 0;
  const isLastPage = page >= pagination.pageCount - 1;

  const handlePage = (newPage: number) => {
    onSetPage?.(newPage);
    setPage(newPage);
  };

  const handleNext = () => {
    if (!isLastPage) {
      onNext?.();
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstPage) {
      onPrev?.();
      setPage(page - 1);
    }
  };

  return (
    <PaginationContainer>
      <SmoothScrollWrapper id={id}>
        <PaginationButton
          onClick={handlePrev}
          disableRipple={false}
          disabled={isFirstPage}
        >
          <ArrowBackIcon
            sx={(theme) => ({
              color: darken(theme.palette.white.main, 0.2),
              ...theme.applyStyles('light', {
                color: lighten(theme.palette.black.main, 0.6),
              }),
            })}
          />
        </PaginationButton>
      </SmoothScrollWrapper>
      {Array.from({ length: pagination.pageCount }).map((_, index) => {
        const pageIndex = index;
        return (
          <SmoothScrollWrapper id={id} key={`pagination-wrapper-${index}`}>
            <PaginationIndexButton
              onClick={() => handlePage(pageIndex)}
              active={pageIndex === page}
            >
              <Typography variant="bodySmallStrong" sx={{ lineHeight: '18px' }}>
                {pageIndex + 1}
              </Typography>
            </PaginationIndexButton>
          </SmoothScrollWrapper>
        );
      })}
      <SmoothScrollWrapper id={id}>
        <PaginationButton onClick={handleNext} disabled={isLastPage}>
          <ArrowForwardIcon
            sx={(theme) => ({
              color: darken(theme.palette.white.main, 0.2),
              ...theme.applyStyles('light', {
                color: lighten(theme.palette.black.main, 0.6),
              }),
            })}
          />
        </PaginationButton>
      </SmoothScrollWrapper>
    </PaginationContainer>
  );
};

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
