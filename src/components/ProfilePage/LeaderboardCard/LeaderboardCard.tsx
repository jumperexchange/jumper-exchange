import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RankIcon } from 'src/components/illustrations/IconRANK';
import { LEADERBOARD_LENGTH } from 'src/components/Leaderboard/Leaderboard';
import type { LeaderboardEntryData } from '../../../hooks/useLeaderboard';
import { useLeaderboardUser } from '../../../hooks/useLeaderboard';
import IconHeader from '../Common/IconHeader';
import {
  CardButton,
  CardButtonContainer,
  LeaderboardUserPositionButton,
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
  const position = leaderboardUserData?.position;
  const isGtMillion = parseInt(position) >= 1000000;

  return (
    <RankContainer>
      <Box sx={{ width: '104px', height: 'auto' }}>
        <IconHeader
          icon={<RankIcon />}
          tooltipKey="profile_page.rankInfo"
          title={t('profile_page.rank')}
        />
      </Box>
      <RankContentContainer>
        <LeaderboardUserPositionButton
          isGtMillion={isGtMillion}
          disabled={!position}
          as={position ? 'a' : 'div'}
          aria-label="Open leaderboard with your position"
          {...(position && { href: `/leaderboard?page=${userPage}` })}
          sx={(theme) => ({
            typography: {
              xs: theme.typography.titleLarge,
            },
          })}
        >
          {position ? t('format.decimal2Digit', { value: position }) : 'N/A'}
        </LeaderboardUserPositionButton>
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
