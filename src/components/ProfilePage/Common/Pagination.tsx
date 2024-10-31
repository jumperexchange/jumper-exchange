import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useLeaderboardPageStore } from 'src/stores/leaderboardPage';
import { NoSelectTypography } from '../ProfilePage.style';

export const Pagination = () => {
  const {
    page,
    maxPages,
    setNextPage,
    setLastPage,
    setFirstPage,
    setPreviousPage,
  } = useLeaderboardPageStore((state) => state);
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
          onClick={setFirstPage}
          sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
        <ChevronLeft
          onClick={setPreviousPage}
          sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
      </Box>
      <NoSelectTypography fontSize="16px" lineHeight="18px" fontWeight={600}>
        {page}/{maxPages}
      </NoSelectTypography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ChevronRight
          onClick={setNextPage}
          sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
        <LastPage
          onClick={setLastPage}
          sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
      </Box>
    </Button>
  );
};
