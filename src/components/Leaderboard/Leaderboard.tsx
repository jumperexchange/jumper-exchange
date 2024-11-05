'use client';
import { Box, Divider, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from '@lifi/wallet-management';
import {
  LEADERBOARD_LENGTH,
  useLeaderboardStore,
} from 'src/stores/leaderboard';
import type {
  LeaderboardEntryData,
  LeaderboardMeta,
} from '../../hooks/useLeaderboard';
import {
  useLeaderboardList,
  useLeaderboardUser,
} from '../../hooks/useLeaderboard';
import { Pagination } from '../ProfilePage/Common/Pagination';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
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

const isValidPage = (page: string, totalPages: number) => {
  const pageNum = parseInt(page, 10);
  return !isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages;
};

export const Leaderboard = ({ page: defaultPage }: { page?: string }) => {
  const { account } = useAccount();
  const { page, setPage, maxPages, setMaxPages } = useLeaderboardStore(
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

  useEffect(() => {
    // set maxPages to the number of pages returned by the API
    if (meta?.pagination?.pagesLength && maxPages === 0) {
      setMaxPages(meta.pagination.pagesLength);
    }

    if (
      !defaultPage ||
      !meta?.pagination?.pagesLength ||
      !isValidPage(defaultPage, meta.pagination.pagesLength)
    ) {
      return;
    }
    setPage(parseInt(defaultPage));

    // maxPages is not needed here but eslint is complaining
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta?.pagination?.pagesLength]);

  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <PageContainer>
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
                    +parseInt(entry.position) ===
                    +parseInt(leaderboardUserData?.position);

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
                        position={
                          typeof entry.position === 'string'
                            ? parseInt(entry.position)
                            : entry.position
                        }
                        points={
                          typeof entry.points === 'string'
                            ? parseInt(entry.points)
                            : entry.points
                        }
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
    </PageContainer>
  );
};
