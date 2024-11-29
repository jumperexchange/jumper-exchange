import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LEADERBOARD_LENGTH } from 'src/components/Leaderboard/Leaderboard';
import { numberWithCommas } from 'src/utils/formatNumbers';
import type { LeaderboardEntryData } from '../../../hooks/useLeaderboard';
import { useLeaderboardUser } from '../../../hooks/useLeaderboard';
import { IconHeader } from '../Common/IconHeader';
import {
  CardButton,
  CardButtonContainer,
  LeaderboardUserPositionButton,
  LeaderboardUserTitle,
  RankContainer,
  RankContentContainer,
} from './LeaderboardCard.style';
import { RANKIcon } from 'src/components/illustrations/IconRANK';
import { Box } from '@mui/material';

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
      <Box>
        <IconHeader
          icon={<RANKIcon size={20} />}
          tooltipKey="profile_page.rankInfo"
          title={t('profile_page.rank')}
        />
      </Box>
      <RankContentContainer>
        {title ? (
          <Link
            aria-label="Open leaderboard with your position"
            href={`/leaderboard?page=${userPage}`}
            passHref
          >
            <LeaderboardUserPositionButton aria-label="Open leaderboard page with your position">
              <LeaderboardUserTitle variant="titleLarge">
                {leaderboardUserData?.position ? title : 'N/A'}
              </LeaderboardUserTitle>
            </LeaderboardUserPositionButton>
          </Link>
        ) : (
          <LeaderboardUserTitle variant="titleLarge">N/A</LeaderboardUserTitle>
        )}
        <CardButtonContainer
          href="/leaderboard"
          passHref
          aria-label="Open leaderboard page"
        >
          <CardButton>{t('leaderboard.title')}</CardButton>
        </CardButtonContainer>
      </RankContentContainer>
    </RankContainer>
  );
};
