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
      <SectionCard>
        <RankCardContentContainer>
          <CardBadgeHeader
            tooltip={t('profile_page.rankInfo')}
            label={t('profile_page.rank')}
          />
          {position ? (
            <Link
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
                })}
              >
                {t('format.decimal2Digit', { value: position })}
              </RankUserPosition>
            </Link>
          ) : (
            <RankUserPosition
              isGtMillion={isGtMillion}
              variant="headerXLarge"
              aria-label="Open leaderboard with your position"
              sx={(theme) => ({
                typography: {
                  xs: theme.typography.titleLarge,
                },
                '&:hover:before': { backgroundColor: 'transparent' },
              })}
            >
              N/A
            </RankUserPosition>
          )}
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
