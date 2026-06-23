import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import type { PDA } from 'src/types/loyaltyPass';
import { formatDateLocalized } from 'src/utils/formatDateLocalized';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';
import {
  AchievementTile,
  TileContent,
  TileFooterRow,
  TileHeaderGroup,
  TileHeaderRow,
  TileImage,
  TileImagePlaceholder,
} from '../Section.style';

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
        <TileHeaderGroup>
          <TileHeaderRow>
            <Typography variant="bodyMediumStrong" color="textPrimary" noWrap>
              {pda.reward.name}
            </Typography>
            <Badge
              label={formatDateLocalized(pda.timestamp, 'MMMM yyyy')}
              variant={BadgeVariant.Alpha}
              size={BadgeSize.SM}
            />
          </TileHeaderRow>
          <Typography
            variant="bodyXSmall"
            color="textSecondary"
            sx={getTextEllipsisStyles(3, 48)}
          >
            {pda.reward.description}
          </Typography>
        </TileHeaderGroup>
        <TileFooterRow>
          <Badge
            label={t('profile_page.yourAchievements.xpEarned', {
              xp: pda.points,
            })}
            variant={pda.points > 0 ? BadgeVariant.Success : BadgeVariant.Alpha}
            size={BadgeSize.MD}
          />
        </TileFooterRow>
      </TileContent>
    </AchievementTile>
  );
};
