import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import type { PDA } from 'src/types/loyaltyPass';
import { formatDateLocalized } from 'src/utils/formatDateLocalized';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';
import {
  AchievementTile,
  ActivityFooterRow,
  ActivityHeaderGroup,
  ActivityHeaderRow,
  TileContent,
  TileImage,
  TileImagePlaceholder,
} from './YourAchievementsSection.styles';

interface ActivityCardProps {
  pda: PDA;
}

export const ActivityCard: FC<ActivityCardProps> = ({ pda }) => {
  const { t } = useTranslation();

  return (
    <AchievementTile>
      {pda.reward.image ? (
        <TileImage src={pda.reward.image} alt={pda.reward.name} />
      ) : (
        <TileImagePlaceholder />
      )}
      <TileContent>
        <ActivityHeaderGroup>
          <ActivityHeaderRow>
            <Typography variant="bodyMediumStrong" color="textPrimary" noWrap>
              {pda.reward.name}
            </Typography>
            <Badge
              label={formatDateLocalized(pda.timestamp, 'MMMM yyyy')}
              variant={BadgeVariant.Alpha}
              size={BadgeSize.SM}
            />
          </ActivityHeaderRow>
          <Typography
            variant="bodyXSmall"
            color="textSecondary"
            sx={getTextEllipsisStyles(3, 48)}
          >
            {pda.reward.description}
          </Typography>
        </ActivityHeaderGroup>
        <ActivityFooterRow>
          <Badge
            label={t('profile_page.yourAchievements.xpEarned', {
              xp: pda.points,
            })}
            variant={pda.points > 0 ? BadgeVariant.Success : BadgeVariant.Alpha}
            size={BadgeSize.MD}
          />
          {pda.ongoing && (
            <Tooltip
              title={t('profile_page.tooltips.ongoingAchievement')}
              arrow
              placement="top"
            >
              <CircularProgress size={24} />
            </Tooltip>
          )}
        </ActivityFooterRow>
      </TileContent>
    </AchievementTile>
  );
};
