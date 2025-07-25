import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { LEADERBOARD_LENGTH } from 'src/components/Leaderboard/Leaderboard';
import { Link } from 'src/components/Link';
import { AppPaths } from 'src/const/urls';
import { useLeaderboardUser } from 'src/hooks/useLeaderboard';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { CardBadgeHeader } from '../CardBadgeHeader/CardBadgeHeader';
import {
  RankButton,
  RankButtonContainer,
  RankCardContainer,
  RankCardContentContainer,
  RankUserPosition,
} from './RankCard.styles';
import { RankCardSkeleton } from './RankCardSkeleton';

interface RankCardProps {}

export const RankCard: FC<RankCardProps> = () => {
  const { walletAddress: address, isLoading } = useContext(ProfileContext);
  const { data: leaderboardUserData, isLoading: isLeaderboardUserDataLoading } =
    useLeaderboardUser(address);
  const { t } = useTranslation();
  const position = leaderboardUserData?.position;
  const userPage = Math.ceil(parseFloat(position) / LEADERBOARD_LENGTH);
  const isGtMillion = parseInt(position) >= 1000000;

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
        {position ? t('format.decimal2Digit', { value: position }) : 'N/A'}
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
      <SectionCard>
        <RankCardContentContainer>
          <CardBadgeHeader
            tooltip={t('profile_page.rankInfo')}
            label={t('profile_page.rank')}
          />
          {renderRankPosition()}
          <RankButtonContainer>
            <RankButton href={AppPaths.Leaderboard}>
              {t('leaderboard.title')}
            </RankButton>
          </RankButtonContainer>
        </RankCardContentContainer>
      </SectionCard>
    </RankCardContainer>
  );
};
