import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useContext } from 'react';
import { isValid, min } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { LEADERBOARD_LENGTH } from '@/components/Leaderboard/Leaderboard';
import { Link } from '@/components/Link/Link';
import { AppPaths } from '@/const/urls';
import { useLeaderboardUser } from '@/hooks/useLeaderboard';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { ProfileContext } from '@/providers/ProfileProvider';
import { formatDateLocalized } from '@/utils/formatDateLocalized';
import {
  RankButton,
  RankCardContainer,
  RankCardContentContainer,
  RankUserPosition,
  rankCardSx,
} from './RankCard.styles';
import { RankCardSkeleton } from './RankCardSkeleton';

interface RankCardProps {}

export const RankCard: FC<RankCardProps> = () => {
  const { walletAddress: address, isLoading } = useContext(ProfileContext);
  const { data: leaderboardUserData, isLoading: isLeaderboardUserDataLoading } =
    useLeaderboardUser(address);
  const { pdas } = useLoyaltyPass(address);
  const { t } = useTranslation();
  const position = leaderboardUserData?.position;
  const userPage = Math.ceil(parseFloat(position) / LEADERBOARD_LENGTH);
  const isGtMillion = parseInt(position) >= 1000000;

  // "Joined" = the date of the user's first collected XP (earliest valid PDA).
  const xpDates = (pdas ?? [])
    .map((pda) => new Date(pda.timestamp))
    .filter(isValid);
  const joinedLabel = xpDates.length
    ? t('profile_page.joined', {
        date: formatDateLocalized(min(xpDates), 'MMMM yyyy'),
      })
    : null;

  if (isLoading || isLeaderboardUserDataLoading) {
    return <RankCardSkeleton />;
  }

  const renderRankPosition = () => {
    const positionElement = (
      <RankUserPosition
        isGtMillion={isGtMillion}
        variant="headerXLarge"
        aria-label={
          position
            ? 'Open leaderboard with your position'
            : 'Your rank position'
        }
        sx={(theme) => ({
          typography: {
            xs: theme.typography.titleLarge,
          },
        })}
      >
        {position
          ? t('format.decimal2Digit', { value: Number(position) })
          : 'N/A'}
      </RankUserPosition>
    );

    if (!position) {
      return positionElement;
    }

    return (
      <Link
        href={`/leaderboard?page=${userPage}`}
        sx={{ textDecoration: 'none' }}
      >
        {positionElement}
      </Link>
    );
  };

  return (
    <RankCardContainer>
      <SectionCard sx={rankCardSx}>
        <RankCardContentContainer>
          <Typography variant="bodyXSmallStrong">
            {t('profile_page.rank')}
          </Typography>
          {renderRankPosition()}
          {joinedLabel ? (
            <Typography
              variant="bodyXSmall"
              sx={{ color: 'alphaLight700.main' }}
            >
              {joinedLabel}
            </Typography>
          ) : null}
        </RankCardContentContainer>
        <RankButton
          href={AppPaths.Leaderboard}
          component={Link}
          data-testid="leaderboard-button"
        >
          {t('profile_page.viewLeaderboard')}
        </RankButton>
      </SectionCard>
    </RankCardContainer>
  );
};
