import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  type SxProps,
  type Theme,
  darken,
  lighten,
} from '@mui/material/styles';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

import type { StrapiMetaPagination } from '@/types/strapi';

import {
  PaginationButton,
  PaginationContainer,
  PaginationIndexButton,
} from './Pagination.style';
import { getVisiblePages } from './utils';

export enum PaginationVariant {
  AllPages = 'allPages',
  WindowedPages = 'windowedPages',
}

interface BasePaginationProps {
  page: number;
  setPage: (page: number) => void;
  pagination: StrapiMetaPagination;
  id?: number | string;
  onPrev?: () => void;
  onNext?: () => void;
  onSetPage?: (page: number) => void;
  sx?: SxProps<Theme>;
}

interface AllPagesPaginationProps extends BasePaginationProps {
  variant: PaginationVariant.AllPages;
}

interface WindowedPagesPaginationProps extends BasePaginationProps {
  variant: PaginationVariant.WindowedPages;
  maxVisiblePages: number;
}

type PaginationProps = AllPagesPaginationProps | WindowedPagesPaginationProps;

export const Pagination = (props: PaginationProps) => {
  const { page, setPage, pagination, id, onPrev, onNext, onSetPage, sx } =
    props;

  const isWindowedVariant = props.variant === PaginationVariant.WindowedPages;
  const showFirstLast = isWindowedVariant ? true : false;
  const showEllipsis = isWindowedVariant ? true : false;
  const maxVisiblePages = isWindowedVariant ? props.maxVisiblePages : undefined;

  const isFirstPage = page === 0;
  const isLastPage = page >= pagination.pageCount - 1;
  const totalPages = pagination.pageCount;

  const effectiveMaxVisible = maxVisiblePages ?? totalPages;
  const visiblePages = getVisiblePages(page, totalPages, effectiveMaxVisible);

  const showStartEllipsis = showEllipsis && visiblePages[0] > 1;
  const showEndEllipsis =
    showEllipsis && visiblePages[visiblePages.length - 1] < totalPages - 2;
  const showFirstPageButton =
    showEllipsis && visiblePages[0] > 0 && !visiblePages.includes(0);
  const showLastPageButton =
    showEllipsis &&
    visiblePages[visiblePages.length - 1] < totalPages - 1 &&
    !visiblePages.includes(totalPages - 1);

  const handlePage = (newPage: number) => {
    onSetPage?.(newPage);
    setPage(newPage);
  };

  const handleFirst = () => {
    if (!isFirstPage) {
      handlePage(0);
    }
  };

  const handleLast = () => {
    if (!isLastPage) {
      handlePage(totalPages - 1);
    }
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

  const arrowIconSx = (theme: Theme) => ({
    color: darken(theme.palette.white.main, 0.2),
    ...theme.applyStyles('light', {
      color: lighten(theme.palette.black.main, 0.6),
    }),
  });

  return (
    <PaginationContainer sx={sx}>
      {showFirstLast && (
        <SmoothScrollWrapper id={id}>
          <PaginationButton
            onClick={handleFirst}
            disableRipple={false}
            disabled={isFirstPage}
          >
            <FirstPageIcon sx={arrowIconSx} />
          </PaginationButton>
        </SmoothScrollWrapper>
      )}
      <SmoothScrollWrapper id={id}>
        <PaginationButton
          onClick={handlePrev}
          disableRipple={false}
          disabled={isFirstPage}
          sx={{ marginRight: 'auto' }}
        >
          <ArrowBackIcon sx={arrowIconSx} />
        </PaginationButton>
      </SmoothScrollWrapper>

      {showFirstPageButton && (
        <>
          <SmoothScrollWrapper id={id}>
            <PaginationIndexButton onClick={() => handlePage(0)} active={false}>
              <Typography variant="bodySmallStrong" sx={{ lineHeight: '18px' }}>
                1
              </Typography>
            </PaginationIndexButton>
          </SmoothScrollWrapper>
          {showStartEllipsis && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5 }}>
              <Typography variant="bodySmallStrong">...</Typography>
            </Box>
          )}
        </>
      )}

      {visiblePages.map((pageIndex) => (
        <SmoothScrollWrapper id={id} key={`pagination-wrapper-${pageIndex}`}>
          <PaginationIndexButton
            onClick={() => handlePage(pageIndex)}
            active={pageIndex === page}
          >
            <Typography variant="bodySmallStrong" sx={{ lineHeight: '18px' }}>
              {pageIndex + 1}
            </Typography>
          </PaginationIndexButton>
        </SmoothScrollWrapper>
      ))}

      {showLastPageButton && (
        <>
          {showEndEllipsis && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5 }}>
              <Typography variant="bodySmallStrong">...</Typography>
            </Box>
          )}
          <SmoothScrollWrapper id={id}>
            <PaginationIndexButton
              onClick={() => handlePage(totalPages - 1)}
              active={false}
            >
              <Typography variant="bodySmallStrong" sx={{ lineHeight: '18px' }}>
                {totalPages}
              </Typography>
            </PaginationIndexButton>
          </SmoothScrollWrapper>
        </>
      )}

      <SmoothScrollWrapper id={id}>
        <PaginationButton
          onClick={handleNext}
          disabled={isLastPage}
          sx={{ marginLeft: 'auto' }}
        >
          <ArrowForwardIcon sx={arrowIconSx} />
        </PaginationButton>
      </SmoothScrollWrapper>
      {showFirstLast && (
        <SmoothScrollWrapper id={id}>
          <PaginationButton
            onClick={handleLast}
            disableRipple={false}
            disabled={isLastPage}
          >
            <LastPageIcon sx={arrowIconSx} />
          </PaginationButton>
        </SmoothScrollWrapper>
      )}
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
