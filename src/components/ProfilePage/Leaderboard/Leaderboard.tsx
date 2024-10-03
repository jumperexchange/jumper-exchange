import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import type {
  LeaderboardEntryData,
  LeaderboardMeta,
} from '../../../hooks/useLeaderboard';
import {
  useLeaderboardList,
  useLeaderboardUser,
} from '../../../hooks/useLeaderboard';
import { IconHeader } from '../Common/IconHeader';
import { Pagination } from '../Common/Pagination';
import { NoSelectTypographyTitlePosition } from '../ProfilePage.style';
import { LeaderboardContainer } from './Leaderboard.style';
import { LeaderboardEntry } from './LeaderboardEntry';
import { LeaderboardSkeleton } from './LeaderboardSkeleton';

const LEADERBOARD_LENGTH = 25;

export const Leaderboard = ({ address }: { address?: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardListLength, setLeaderboardListLength] =
    useState(LEADERBOARD_LENGTH);

  const {
    data: leaderboardData,
    meta,
  }: { data: LeaderboardEntryData[]; meta: LeaderboardMeta } =
    useLeaderboardList(currentPage, LEADERBOARD_LENGTH);
  const { data: leaderboardUserData }: { data: LeaderboardEntryData } =
    useLeaderboardUser(address);

  // set leaderboard list length to the number of pages only once
  useEffect(() => {
    if (
      meta?.pagination?.pagesLength &&
      leaderboardListLength === LEADERBOARD_LENGTH
    ) {
      setLeaderboardListLength(meta.pagination.pagesLength);
    }
    // leaderboardListLength is not needed here but eslint is complaining
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta?.pagination?.pagesLength]);

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, leaderboardListLength));
  };

  const previousPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1));
  };

  const firstPage = () => {
    setCurrentPage(1);
  };

  const lastPage = () => {
    setCurrentPage(leaderboardListLength);
  };

  // go to page with user's position
  const goToUserPosition = () => {
    const usersPosition = leaderboardUserData?.position;
    if (usersPosition) {
      const calculatedPage = Math.ceil(usersPosition / LEADERBOARD_LENGTH);
      setCurrentPage(calculatedPage);
    }
  };

  return (
    <LeaderboardContainer>
      <IconHeader tooltipKey="profile_page.rank" title="RANK" />
      <NoSelectTypographyTitlePosition
        hasPosition={!!leaderboardUserData?.position}
        onClick={goToUserPosition}
        fontWeight={700}
      >
        {leaderboardUserData?.position ?? '-'}
      </NoSelectTypographyTitlePosition>
      <Stack direction={'column'} sx={{ margin: '20px 0' }}>
        {!leaderboardData?.length ? (
          <LeaderboardSkeleton length={LEADERBOARD_LENGTH} />
        ) : (
          leaderboardData?.map((entry: LeaderboardEntryData, index: number) => (
            <LeaderboardEntry
              key={index}
              isUserPosition={
                +entry.position === +leaderboardUserData?.position
              }
              walletAddress={entry.walletAddress}
              position={entry.position}
              points={entry.points}
            />
          ))
        )}
      </Stack>
      {leaderboardListLength > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={leaderboardListLength}
          onFirstPage={firstPage}
          onPreviousPage={previousPage}
          onNextPage={nextPage}
          onLastPage={lastPage}
        />
      )}
    </LeaderboardContainer>
  );
};
