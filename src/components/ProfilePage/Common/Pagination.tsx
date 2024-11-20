import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import {
  PaginationButton,
  PaginationClosestPages,
  PaginationContainer,
  PaginationLink,
} from './Pagination.style';
import { PaginationNavigator } from './PaginationNavigator';
import { PaginationButtonNavigatorBox } from './PaginationNavigator.style';

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
      <PaginationButtonNavigatorBox>
        <PaginationNavigator
          href={`/leaderboard?page=1`}
          icon={<FirstPage sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />}
          disabled={page === 1}
        />
        <PaginationNavigator
          href={`/leaderboard?page=${page !== 1 ? page - 1 : maxPages}`}
          icon={
            <ChevronLeft sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />
          }
          disabled={page === 1}
        />
      </PaginationButtonNavigatorBox>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0, sm: '8px' },
        }}
      >
        {starterIndex !== 1 && (
          <PaginationClosestPages>
            <PaginationLink href={`/leaderboard?page=1`}>
              <PaginationButton>
                <Typography variant="bodySmallStrong">1</Typography>
              </PaginationButton>
            </PaginationLink>
            <Typography variant="bodySmallStrong" component="span">
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
              <Typography variant="bodySmallStrong">{pageNr}</Typography>
            </PaginationButton>
          </PaginationLink>
        ))}
        {page <= maxPages - paginationMedian && (
          <PaginationClosestPages>
            <Typography variant="bodySmallStrong" component={'span'}>
              ...
            </Typography>
            <PaginationLink href={`/leaderboard?page=${maxPages}`}>
              <PaginationButton>
                <Typography variant="bodySmallStrong">{maxPages}</Typography>
              </PaginationButton>
            </PaginationLink>
          </PaginationClosestPages>
        )}
      </Box>

      <PaginationButtonNavigatorBox>
        <PaginationNavigator
          href={`/leaderboard?page=${page !== maxPages ? page + 1 : 1}`}
          icon={
            <ChevronRight sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />
          }
          disabled={page === maxPages}
        />
        <PaginationNavigator
          href={`/leaderboard?page=${maxPages}`}
          icon={<LastPage sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />}
          disabled={page === maxPages}
        />
      </PaginationButtonNavigatorBox>
    </PaginationContainer>
  );
};
