import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { LeaderboardEntryData } from '../../../hooks/useLeaderboard';
import { useLeaderboardUser } from '../../../hooks/useLeaderboard';
import { IconHeader } from '../Common/IconHeader';
import { TierboxInfoTitles } from '../LevelBox/TierBox.style';
import {
  CardButton,
  LeaderboardUserPositionButton,
  RankContainer,
  RankContentContainer,
} from './LeaderboardCard.style';

export const LeaderboardCard = ({ address }: { address?: string }) => {
  const { data: leaderboardUserData }: { data: LeaderboardEntryData } =
    useLeaderboardUser(address);
  const { t } = useTranslation();

  const handleUserPositionLink = () => {};

  return (
    <RankContainer>
      <IconHeader
        tooltipKey="profile_page.rankInfo"
        title={t('profile_page.rank')}
      />
      <RankContentContainer>
        <LeaderboardUserPositionButton onClick={handleUserPositionLink}>
          <TierboxInfoTitles variant="headerLarge" alignSelf={'flex-start'}>
            {leaderboardUserData?.position ?? '-'}
          </TierboxInfoTitles>
        </LeaderboardUserPositionButton>
        <Link href="/leaderboard" passHref>
          <CardButton>{t('leaderboard.title')}</CardButton>
        </Link>
      </RankContentContainer>
    </RankContainer>
  );
};
