'use client';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from '@lifi/wallet-management';
import { Box } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import useClient from 'src/hooks/useClient';
import type { LeaderboardEntryData } from '../../hooks/useLeaderboard';
import {
  useLeaderboardList,
  useLeaderboardUser,
} from '../../hooks/useLeaderboard';
import IconHeader from '../ProfilePage/Common/IconHeader';
import {
  Pagination,
  PaginationVariant,
} from '@/components/core/Pagination/Pagination';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import type { StrapiMetaPagination } from '@/types/strapi';
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
  const router = useRouter();
  const pathname = usePathname();

  const { data: leaderboardData, meta } = useLeaderboardList(
    defaultPage,
    LEADERBOARD_LENGTH,
  );
  const { data: leaderboardUserData } = useLeaderboardUser(account?.address);

  const totalPages = meta?.pagination?.pagesLength || 1;

  const currentPage = useMemo(() => {
    return isValidPage(defaultPage, totalPages) ? defaultPage : 1;
  }, [defaultPage, totalPages]);

  const pagination: StrapiMetaPagination = useMemo(
    () => ({
      page: currentPage,
      pageSize: LEADERBOARD_LENGTH,
      pageCount: totalPages,
      total: totalPages * LEADERBOARD_LENGTH,
    }),
    [currentPage, totalPages],
  );

  const handleSetPage = (newPage: number) => {
    router.push(`${pathname}?page=${newPage + 1}`);
  };

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
                  tooltip={t('leaderboard.description')}
                  title={
                    !isMobile
                      ? `Updated: ${t('format.date', { value: new Date() })}`
                      : undefined
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
        {totalPages > 1 && (
          <Pagination
            variant={PaginationVariant.WindowedPages}
            page={currentPage - 1}
            setPage={handleSetPage}
            pagination={pagination}
            maxVisiblePages={5}
            sx={{ width: '100%' }}
          />
        )}
      </LeaderboardContainer>
    </PageContainer>
  );
};
