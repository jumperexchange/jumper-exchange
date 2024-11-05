import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LEADERBOARD_LENGTH } from 'src/stores/leaderboard';
import { numberWithCommas } from 'src/utils/formatNumbers';
import type { LeaderboardEntryData } from '../../../hooks/useLeaderboard';
import { useLeaderboardUser } from '../../../hooks/useLeaderboard';
import { IconHeader } from '../Common/IconHeader';
import {
  CardButton,
  LeaderboardUserPositionButton,
  LeaderboardUserTitle,
  RankContainer,
  RankContentContainer,
} from './LeaderboardCard.style';

export const LeaderboardCard = ({ address }: { address?: string }) => {
  const { data: leaderboardUserData }: { data: LeaderboardEntryData } =
    useLeaderboardUser(address);
  const { t } = useTranslation();
  const userPage = Math.ceil(
    parseFloat(leaderboardUserData?.position) / LEADERBOARD_LENGTH,
  );
  const title = numberWithCommas(leaderboardUserData?.position);

  return (
    <RankContainer>
      <IconHeader
        tooltipKey="profile_page.rankInfo"
        title={t('profile_page.rank')}
      />
      <RankContentContainer>
        <Link href={`/leaderboard?page=${userPage}`} passHref>
          <LeaderboardUserPositionButton aria-label="Open leaderboard page with your position">
            <LeaderboardUserTitle variant="headerLarge">
              {leaderboardUserData?.position ? title : '-'}
            </LeaderboardUserTitle>
          </LeaderboardUserPositionButton>
        </Link>
        <Link href="/leaderboard" passHref>
          <CardButton>{t('leaderboard.title')}</CardButton>
        </Link>
      </RankContentContainer>
    </RankContainer>
  );
};
