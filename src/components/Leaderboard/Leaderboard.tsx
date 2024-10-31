'use client';
import { Box, Container, Divider, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from '@lifi/wallet-management';
import {
  LEADERBOARD_LENGTH,
  useLeaderboardPageStore,
} from 'src/stores/leaderboardPage';
import type {
  LeaderboardEntryData,
  LeaderboardMeta,
} from '../../hooks/useLeaderboard';
import {
  useLeaderboardList,
  useLeaderboardUser,
} from '../../hooks/useLeaderboard';
import { Pagination } from '../ProfilePage/Common/Pagination';
import { TooltipInfo } from '../TooltipInfo/TooltipInfo';
import {
  LeaderboardContainer,
  LeaderboardEntryStack,
  LeaderboardHeader,
  LeaderboardUpdateDateLabel,
} from './Leaderboard.style';
import { LeaderboardEntry } from './LeaderboardEntry';
import { LeaderboardEntrySkeleton } from './LeaderboardEntrySkeleton';
import { LeaderboardUserEntry } from './LeaderboardUserEntry';

export const Leaderboard = ({ page: defaultPage }: { page?: string }) => {
  const { account } = useAccount();
  const { page, setPage, maxPages, setMaxPages } = useLeaderboardPageStore(
    (state) => state,
  );

  const { t } = useTranslation();

  const {
    data: leaderboardData,
    meta,
  }: { data: LeaderboardEntryData[]; meta: LeaderboardMeta } =
    useLeaderboardList(page, LEADERBOARD_LENGTH);
  const { data: leaderboardUserData }: { data: LeaderboardEntryData } =
    useLeaderboardUser(account?.address);

  // set leaderboard list length to the number of pages only once
  useEffect(() => {
    if (defaultPage) {
      setPage(parseInt(defaultPage));
    }
    if (meta?.pagination?.pagesLength && maxPages === LEADERBOARD_LENGTH) {
      setMaxPages(meta.pagination.pagesLength);
    }
    // maxPages is not needed here but eslint is complaining
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta?.pagination?.pagesLength]);

  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Container>
      <LeaderboardContainer>
        <LeaderboardHeader>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant="headerMedium">
              {t('leaderboard.title')}
            </Typography>
            <TooltipInfo title={t('leaderboard.description')} size={24} />
          </Box>
          <LeaderboardUpdateDateLabel variant="bodyXSmallStrong">
            {t('leaderboard.updatedLabel', { date: date })}
          </LeaderboardUpdateDateLabel>
        </LeaderboardHeader>
        <LeaderboardUserEntry />
        <LeaderboardEntryStack direction={'column'}>
          {!leaderboardData?.length
            ? Array.from({ length: LEADERBOARD_LENGTH }).map((_, index) => (
                <>
                  <LeaderboardEntrySkeleton
                    key={`leaderboard-entry-${index}-skeleton`}
                    isUserPosition={false}
                  />
                  {index !== LEADERBOARD_LENGTH - 1 && (
                    <Divider
                      key={`leaderboard-entry-${index}-skeleton-divider`}
                    />
                  )}
                </>
              ))
            : leaderboardData?.map(
                (entry: LeaderboardEntryData, index: number) => {
                  const isUserPosition =
                    +entry.position === +leaderboardUserData?.position;
                  return (
                    <>
                      <LeaderboardEntry
                        key={`leaderboard-entry-${index}`}
                        isUserPosition={isUserPosition}
                        walletAddress={
                          isUserPosition && account.address
                            ? account.address
                            : entry.walletAddress
                        }
                        position={entry.position}
                        points={entry.points}
                      />
                      {index !== leaderboardData.length - 1 && (
                        <Divider key={`leaderboard-entry-${index}-divider`} />
                      )}
                    </>
                  );
                },
              )}
        </LeaderboardEntryStack>
        {maxPages > 1 && <Pagination />}
      </LeaderboardContainer>
    </Container>
  );
};
