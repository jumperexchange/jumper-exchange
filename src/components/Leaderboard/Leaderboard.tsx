'use client';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from '@lifi/wallet-management';
import { Box } from '@mui/material';
import useClient from 'src/hooks/useClient';
import type { LeaderboardEntryData } from '../../hooks/useLeaderboard';
import {
  useLeaderboardList,
  useLeaderboardUser,
} from '../../hooks/useLeaderboard';
import IconHeader from '../ProfilePage/Common/IconHeader';
import { Pagination } from '../ProfilePage/Common/Pagination';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import {
  LeaderboardContainer,
  LeaderboardEntryDivider,
  LeaderboardEntryStack,
  LeaderboardHeader,
  LeaderboardTitleBox,
  LeaderboardUpdateDateBox,
} from './Leaderboard.style';
import { LeaderboardEntry } from './LeaderboardEntry';
import { LeaderboardEntrySkeleton } from './LeaderboardEntrySkeleton';
import { LeaderboardUserEntry } from './LeaderboardUserEntry';

export const LEADERBOARD_LENGTH = 25;

const isValidPage = (pageNum: number, totalPages: number) => {
  return !isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages;
};

export const Leaderboard = ({ page: defaultPage }: { page: number }) => {
  const { account } = useAccount();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const { t } = useTranslation();
  const theme = useTheme();
  const isClient = useClient();

  const { data: leaderboardData, meta } = useLeaderboardList(
    defaultPage,
    LEADERBOARD_LENGTH,
  );
  const { data: leaderboardUserData } = useLeaderboardUser(account?.address);

  const currentPage = useMemo(() => {
    return isValidPage(defaultPage, meta?.pagination?.pagesLength)
      ? defaultPage
      : 1;
  }, [defaultPage, meta?.pagination.pagesLength]);

  // const date = new Date().toLocaleDateString('en-GB', {
  //   day: 'numeric',
  //   month: 'long',
  //   year: 'numeric',
  // });

  return (
    <PageContainer>
      <LeaderboardContainer>
        <LeaderboardHeader>
          <LeaderboardTitleBox>
            <Typography variant="headerMedium">
              {t('leaderboard.title')}
            </Typography>
            <LeaderboardUpdateDateBox>
              {isClient && (
                <IconHeader
                  tooltipKey={t('leaderboard.description')}
                  title={
                    !isMobile
                      ? `Updated: ${t('format.date', { value: new Date() })}`
                      : ''
                  }
                />
              )}
            </LeaderboardUpdateDateBox>
          </LeaderboardTitleBox>
        </LeaderboardHeader>
        <LeaderboardUserEntry />
        <LeaderboardEntryStack direction={'column'}>
          {!leaderboardData?.length
            ? Array.from({ length: LEADERBOARD_LENGTH }).map((_, index) => (
                <Box key={`leaderboard-entry-${index}-fragment`}>
                  <LeaderboardEntrySkeleton
                    key={`leaderboard-entry-${index}-skeleton`}
                    isUserPosition={false}
                  />
                  {index !== LEADERBOARD_LENGTH - 1 && (
                    <LeaderboardEntryDivider
                      key={`leaderboard-entry-divider=${index}-skeleton`}
                    />
                  )}
                </Box>
              ))
            : leaderboardData?.map(
                (entry: LeaderboardEntryData, index: number) => {
                  const isUserPosition =
                    +parseInt(entry.position) ===
                    +parseInt(leaderboardUserData?.position);

                  return (
                    <Box key={`leaderboard-entry-${index}-fragment`}>
                      <LeaderboardEntry
                        key={`leaderboard-entry-${index}`}
                        isUserPosition={isUserPosition}
                        walletAddress={entry.walletAddress}
                        position={entry.position}
                        points={entry.points}
                      />
                      {index !== leaderboardData.length - 1 && (
                        <LeaderboardEntryDivider
                          key={`leaderboard-entry-divider-${index}`}
                        />
                      )}
                    </Box>
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
