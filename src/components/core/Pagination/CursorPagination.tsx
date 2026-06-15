'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { type SxProps, type Theme } from '@mui/material/styles';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import {
  PaginationContainer,
  PaginationNavButton,
  paginationArrowIconSx,
} from './Pagination.style';

export interface CursorPaginationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
  id?: number | string;
  sx?: SxProps<Theme>;
  onPrev?: () => void;
  onNextTrack?: () => void;
  previousLabel?: string;
  nextLabel?: string;
}

export const CursorPagination = ({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  disabled = false,
  id,
  sx,
  onPrev,
  onNextTrack,
  previousLabel,
  nextLabel,
}: CursorPaginationProps) => {
  const { t } = useTranslation();
  const previousLabelText = previousLabel ?? t('pagination.previous');
  const nextLabelText = nextLabel ?? t('pagination.next');

  const handlePrevious = () => {
    if (disabled || !hasPrevious) {
      return;
    }
    onPrev?.();
    onPrevious();
  };

  const handleNext = () => {
    if (disabled || !hasNext) {
      return;
    }
    onNextTrack?.();
    onNext();
  };

  return (
    <PaginationContainer as="nav" aria-label="Pagination" sx={sx}>
      <SmoothScrollWrapper id={id}>
        <PaginationNavButton
          onClick={handlePrevious}
          disableRipple={false}
          disabled={disabled || !hasPrevious}
          aria-label={previousLabelText}
          startIcon={<ArrowBackIcon sx={paginationArrowIconSx} />}
          sx={{ marginRight: 'auto' }}
        >
          {previousLabelText}
        </PaginationNavButton>
      </SmoothScrollWrapper>
      <SmoothScrollWrapper id={id}>
        <PaginationNavButton
          onClick={handleNext}
          disabled={disabled || !hasNext}
          aria-label={nextLabelText}
          endIcon={<ArrowForwardIcon sx={paginationArrowIconSx} />}
          sx={{ marginLeft: 'auto' }}
        >
          {nextLabelText}
        </PaginationNavButton>
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
