import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import type { LeaderboardEntryData } from '../../../hooks/useLeaderboard';
import { useLeaderboardUser } from '../../../hooks/useLeaderboard';
import { IconHeader } from '../Common/IconHeader';
import { NoSelectTypographyTitle } from '../ProfilePage.style';
import { CardButton, RankContainer } from './LeaderboardCard.style';

export const LeaderboardCard = ({ address }: { address?: string }) => {
  const { data: leaderboardUserData }: { data: LeaderboardEntryData } =
    useLeaderboardUser(address);
  const { t } = useTranslation();

  return (
    <RankContainer>
      <Box>
        <IconHeader
          tooltipKey="profile_page.rankInfo"
          title={t('profile_page.rank')}
        />
        <NoSelectTypographyTitle>
          {leaderboardUserData?.position ?? '-'}
        </NoSelectTypographyTitle>
      </Box>
      <CardButton>{t('profile_page.leaderboard')}</CardButton>
    </RankContainer>
  );
};
