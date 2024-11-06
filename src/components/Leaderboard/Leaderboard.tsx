'use client';
import { Box, Divider, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from '@lifi/wallet-management';
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

export const LEADERBOARD_LENGTH = 25;

const isValidPage = (page: string, totalPages: number) => {
  const pageNum = parseInt(page, 10);
  return !isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages;
};

export const Leaderboard = ({ page: defaultPage = '1' }: { page?: string }) => {
  const { account } = useAccount();

  const { t } = useTranslation();

  const {
    data: leaderboardData,
    meta,
  }: { data: LeaderboardEntryData[]; meta: LeaderboardMeta } =
    useLeaderboardList(parseInt(defaultPage), LEADERBOARD_LENGTH);
  const { data: leaderboardUserData }: { data: LeaderboardEntryData } =
    useLeaderboardUser(account?.address);

  const currentPage = useMemo(() => {
    return isValidPage(defaultPage, meta?.pagination?.pagesLength)
      ? parseInt(defaultPage)
      : 1;
  }, [defaultPage, meta?.pagination.pagesLength]);

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
        {meta?.pagination?.pagesLength > 1 && (
          <Pagination
            page={currentPage}
            maxPages={meta.pagination.pagesLength}
          />
        )}
      </LeaderboardContainer>
    </PageContainer>
  );
};