import { Box, Button } from '@mui/material';
import {
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { NoSelectTypography } from '@/components/ProfilePage/ProfilePage.style';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
}: PaginationProps) => {
  return (
    <Button
      aria-label="Page Navigation"
      size="medium"
      sx={{
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        pointerEvents: 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FirstPage
          onClick={onFirstPage}
          sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
        <ChevronLeft
          onClick={onPreviousPage}
          sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
      </Box>
      <NoSelectTypography fontSize="16px" lineHeight="18px" fontWeight={600}>
        {currentPage}/{totalPages}
      </NoSelectTypography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ChevronRight
          onClick={onNextPage}
          sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
        <LastPage
          onClick={onLastPage}
          sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
      </Box>
    </Button>
  );
};
