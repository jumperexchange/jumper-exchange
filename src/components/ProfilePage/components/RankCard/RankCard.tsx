import { FC, useContext } from 'react';
import { CardBadgeHeader } from '../CardBadgeHeader/CardBadgeHeader';
import { useTranslation } from 'react-i18next';
import {
  RankUserPosition,
  RankCardContainer,
  RankButtonContainer,
  RankButton,
} from './RankCard.styles';
import { LEADERBOARD_LENGTH } from 'src/components/Leaderboard/Leaderboard';
import { useLeaderboardUser } from 'src/hooks/useLeaderboard';
import { AppPaths } from 'src/const/urls';
import { Link } from 'src/components/Link';
import { RankCardSkeleton } from './RankCardSkeleton';
import { ProfileContext } from 'src/providers/ProfileProvider';

interface RankCardProps {}

export const RankCard: FC<RankCardProps> = () => {
  const { walletAddress: address, isLoading } = useContext(ProfileContext);
  const { data: leaderboardUserData, isLoading: isLeaderboardUserDataLoading } =
    useLeaderboardUser(address);
  const { t } = useTranslation();
  const userPage = Math.ceil(
    parseFloat(leaderboardUserData?.position) / LEADERBOARD_LENGTH,
  );
  const position = leaderboardUserData?.position;
  const isGtMillion = parseInt(position) >= 1000000;

  if (isLoading || isLeaderboardUserDataLoading) {
    return <RankCardSkeleton />;
  }

  return (
    <RankCardContainer>
      <CardBadgeHeader
        tooltip={t('profile_page.rankInfo')}
        label={t('profile_page.rank')}
      />
      <Link
        as={position ? 'a' : 'div'}
        href={`/leaderboard?page=${userPage}`}
        sx={{ textDecoration: 'none' }}
      >
        <RankUserPosition
          isGtMillion={isGtMillion}
          variant="headerXLarge"
          aria-label="Open leaderboard with your position"
          sx={(theme) => ({
            typography: {
              xs: theme.typography.titleLarge,
            },
            ...(!position && {
              '&:hover:before': { backgroundColor: 'transparent' },
            }),
          })}
        >
          {position ? t('format.decimal2Digit', { value: position }) : 'N/A'}
        </RankUserPosition>
      </Link>
      <RankButtonContainer>
        <RankButton href={AppPaths.Leaderboard}>
          {t('leaderboard.title')}
        </RankButton>
      </RankButtonContainer>
    </RankCardContainer>
  );
};
