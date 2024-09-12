import { alpha, Box, Stack, Tooltip, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  NoSelectTypography,
  NoSelectTypographyTitle,
} from '../ProfilePage.style';
import { LeaderboardContainer } from './Leaderboard.style';
import { XPIcon } from '../../../components/illustrations/XPIcon';
import InfoIcon from '@mui/icons-material/Info';
import {
  useLeaderboardList,
  useLeaderboardUser,
} from '../../../hooks/useLeaderboard';
import { Button } from '../../../components/Button';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { useEffect, useState } from 'react';
import { LeaderboardSkeleton } from './LeaderboardSkeleton';
import { FirstPage, LastPage } from '@mui/icons-material';

const LEADERBOARD_LENGTH = 25;

interface LeaderboardEntry {
  position: number;
  walletAddress: string;
  points: number;
}

interface LeaderboardUserData {
  position: number;
  points: number;
}

interface LeaderboardMeta {
  pagination: {
    pagesLength: number;
  };
}

export const Leaderboard = ({ address }: { address?: string }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardListLength, setLeaderboardListLength] =
    useState(LEADERBOARD_LENGTH);

  const {
    data: leaderboardData,
    meta,
  }: { data: LeaderboardEntry[]; meta: LeaderboardMeta } = useLeaderboardList(
    currentPage,
    LEADERBOARD_LENGTH,
  );
  const { data: leaderboardUserData }: { data: LeaderboardUserData } =
    useLeaderboardUser(address);

  // set leaderboard list length to the number of pages only once
  useEffect(() => {
    if (
      meta?.pagination?.pagesLength &&
      leaderboardListLength === LEADERBOARD_LENGTH
    ) {
      setLeaderboardListLength(meta.pagination.pagesLength);
    }
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
      <NoSelectTypography fontSize="14px" lineHeight="18px" fontWeight={700}>
        RANK
        <Tooltip
          title={t('profile_page.rank')}
          placement="top"
          enterTouchDelay={0}
          arrow
        >
          <InfoIcon
            sx={{
              width: 16,
              height: 16,
              top: '3px',
              left: '8px',
              position: 'relative',
              opacity: '0.5',
            }}
          />
        </Tooltip>
      </NoSelectTypography>
      <NoSelectTypographyTitle
        onClick={goToUserPosition}
        fontWeight={700}
        sx={{
          fontSize: { xs: 28, sm: 48 },
          borderRadius: '12px',
          textIndent: '12px',
          ...(leaderboardUserData?.position
            ? {
                cursor: 'pointer',
                transition: 'background-color 0.3s ease-in',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.black.main, 0.04),
                },
              }
            : {
                pointerEvents: 'none',
              }),
        }}
      >
        {leaderboardUserData?.position ?? '-'}
      </NoSelectTypographyTitle>
      <Stack direction={'column'} sx={{ margin: '20px 0' }}>
        {!leaderboardData?.length ? (
          <LeaderboardSkeleton length={LEADERBOARD_LENGTH} />
        ) : (
          leaderboardData?.map((entry: LeaderboardEntry, index: number) => (
            <Box
              key={index}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              sx={{
                width: '100%',
                margin: '10px 0',
                position: 'relative',
                ...(+entry.position === +leaderboardUserData?.position && {
                  '&:before': {
                    position: 'absolute',
                    top: '-6px',
                    left: '-12px',
                    content: '""',
                    height: '36px',
                    width: '312px',
                    borderRadius: '6px',
                    backgroundColor: alpha(theme.palette.black.main, 0.04),
                  },
                }),
              }}
            >
              <NoSelectTypography
                fontSize="18px"
                lineHeight="18px"
                fontWeight={500}
                sx={{ opacity: '0.5', width: '25px' }}
              >
                {entry.position}.
              </NoSelectTypography>
              <NoSelectTypography
                fontSize="18px"
                lineHeight="18px"
                fontWeight={600}
                sx={{ width: '110px' }}
              >
                {entry.walletAddress}
              </NoSelectTypography>
              <Box display={'flex'} alignItems={'center'}>
                <NoSelectTypography
                  fontSize="18px"
                  lineHeight="18px"
                  fontWeight={600}
                  marginRight={'5px'}
                >
                  {entry.points}
                </NoSelectTypography>
                <XPIcon size={24} />
              </Box>
            </Box>
          ))
        )}
      </Stack>
      {leaderboardListLength > 1 && (
        <Box>
          <Button
            aria-label="Page Navigation"
            variant="secondary"
            size="medium"
            styles={{
              alignItems: 'center',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FirstPage
                onClick={firstPage}
                sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              <ChevronLeft
                onClick={previousPage}
                sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
            </Box>
            <NoSelectTypography
              fontSize="16px"
              lineHeight="18px"
              fontWeight={600}
            >
              {currentPage}/{leaderboardListLength}
            </NoSelectTypography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ChevronRight
                onClick={nextPage}
                sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              <LastPage
                onClick={lastPage}
                sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
            </Box>
          </Button>
        </Box>
      )}
    </LeaderboardContainer>
  );
};
