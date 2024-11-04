import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useLeaderboardStore } from 'src/stores/leaderboard';
import {
  PaginationButton,
  PaginationClosestPages,
  PaginationContainer,
} from './Pagination.style';

const PAGINATION_NR_OF_PAGES_TO_DISPLAY = 5;

export const Pagination = () => {
  const {
    page,
    maxPages,
    setPage,
    setNextPage,
    setLastPage,
    setFirstPage,
    setPreviousPage,
  } = useLeaderboardStore((state) => state);

  let starterIndex = 1;
  const paginationMedian = Math.round(PAGINATION_NR_OF_PAGES_TO_DISPLAY / 2);
  const getPagesToDisplay = () => {
    if (
      page >= paginationMedian &&
      page <= maxPages - PAGINATION_NR_OF_PAGES_TO_DISPLAY + 1
    ) {
      starterIndex = page - paginationMedian + 1;
    } else if (page < paginationMedian) {
      starterIndex = 1;
    } else {
      starterIndex = maxPages - PAGINATION_NR_OF_PAGES_TO_DISPLAY + 1;
    }
    return Array.from(
      { length: PAGINATION_NR_OF_PAGES_TO_DISPLAY },
      (value, index) => starterIndex + index,
    );
  };

  const displayedPages = getPagesToDisplay();

  return (
    <PaginationContainer>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton>
          <FirstPage
            onClick={setFirstPage}
            sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
          />
        </IconButton>
        <IconButton>
          <ChevronLeft
            onClick={setPreviousPage}
            sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
          />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {starterIndex !== 1 && (
          <PaginationClosestPages>
            <PaginationButton onClick={setFirstPage}>
              <Typography variant="bodyXSmallStrong">1</Typography>
            </PaginationButton>
            <Typography variant="bodyXSmallStrong" component="span">
              ...
            </Typography>
          </PaginationClosestPages>
        )}
        {displayedPages.map((pageNr, index) => (
          <PaginationButton
            activePage={page === pageNr}
            key={`pagination-pageNr-${index}`}
            onClick={() => {
              if (page !== pageNr) {
                setPage(pageNr);
              }
            }}
          >
            <Typography variant="bodyXSmallStrong">{pageNr}</Typography>
          </PaginationButton>
        ))}
        {page <= maxPages - PAGINATION_NR_OF_PAGES_TO_DISPLAY + 1 && (
          <PaginationClosestPages>
            <Typography variant="bodyXSmallStrong" component={'span'}>
              ...
            </Typography>
            <PaginationButton onClick={setLastPage}>
              <Typography variant="bodyXSmallStrong">{maxPages}</Typography>
            </PaginationButton>
          </PaginationClosestPages>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton>
          <ChevronRight
            onClick={setNextPage}
            sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
          />
        </IconButton>
        <IconButton>
          <LastPage
            onClick={setLastPage}
            sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
          />
        </IconButton>
      </Box>
    </PaginationContainer>
  );
};
