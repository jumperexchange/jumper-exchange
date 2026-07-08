'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { type SxProps, type Theme } from '@mui/material/styles';
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
  previousLabel,
  nextLabel,
}: CursorPaginationProps) => {
  const { t } = useTranslation();
  const previousLabelText = previousLabel ?? t('pagination.previous');
  const nextLabelText = nextLabel ?? t('pagination.next');

  const scrollToId = () => {
    if (id !== undefined) {
      document
        .getElementById(String(id))
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (disabled || !hasPrevious) {
      return;
    }
    onPrevious();
    scrollToId();
  };

  const handleNext = () => {
    if (disabled || !hasNext) {
      return;
    }
    onNext();
    scrollToId();
  };

  return (
    <PaginationContainer as="nav" aria-label="Pagination" sx={sx}>
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
      <PaginationNavButton
        onClick={handleNext}
        disabled={disabled || !hasNext}
        aria-label={nextLabelText}
        endIcon={<ArrowForwardIcon sx={paginationArrowIconSx} />}
        sx={{ marginLeft: 'auto' }}
      >
        {nextLabelText}
      </PaginationNavButton>
    </PaginationContainer>
  );
};
