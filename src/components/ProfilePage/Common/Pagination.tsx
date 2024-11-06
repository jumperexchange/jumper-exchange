import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import {
  PaginationButton,
  PaginationClosestPages,
  PaginationContainer,
  PaginationLink,
} from './Pagination.style';

const PAGINATION_NR_OF_PAGES_TO_DISPLAY = 5;

export const Pagination = ({
  page,
  maxPages,
}: {
  page: number;
  maxPages: number;
}) => {
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
      starterIndex = maxPages - PAGINATION_NR_OF_PAGES_TO_DISPLAY;
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
        <PaginationLink href={`/leaderboard?page=1`}>
          <IconButton>
            <FirstPage sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />
          </IconButton>
        </PaginationLink>
        <PaginationLink
          href={`/leaderboard?page=${page !== 1 ? page - 1 : maxPages}`}
        >
          <IconButton>
            <ChevronLeft sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />
          </IconButton>
        </PaginationLink>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {starterIndex !== 1 && (
          <PaginationClosestPages>
            <PaginationLink href={`/leaderboard?page=1`}>
              <PaginationButton>
                <Typography variant="bodyXSmallStrong">1</Typography>
              </PaginationButton>
            </PaginationLink>
            <Typography variant="bodyXSmallStrong" component="span">
              ...
            </Typography>
          </PaginationClosestPages>
        )}
        {displayedPages.map((pageNr, index) => (
          <PaginationLink
            href={`/leaderboard?page=${pageNr}`}
            key={`pagination-pageNr-${index}`}
          >
            <PaginationButton
              activePage={page === pageNr}
              key={`pagination-pageNr-${index}`}
            >
              <Typography variant="bodyXSmallStrong">{pageNr}</Typography>
            </PaginationButton>
          </PaginationLink>
        ))}
        {page <= maxPages - paginationMedian && (
          <PaginationClosestPages>
            <Typography variant="bodyXSmallStrong" component={'span'}>
              ...
            </Typography>
            <PaginationLink href={`/leaderboard?page=${maxPages}`}>
              <PaginationButton>
                <Typography variant="bodyXSmallStrong">{maxPages}</Typography>
              </PaginationButton>
            </PaginationLink>
          </PaginationClosestPages>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PaginationLink
          href={`/leaderboard?page=${page !== maxPages ? page + 1 : 1}`}
        >
          <IconButton>
            <ChevronRight sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />
          </IconButton>
        </PaginationLink>
        <PaginationLink href={`/leaderboard?page=${maxPages}`}>
          <IconButton>
            <LastPage sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />
          </IconButton>
        </PaginationLink>
      </Box>
    </PaginationContainer>
  );
};
