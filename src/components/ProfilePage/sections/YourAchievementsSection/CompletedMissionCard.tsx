import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import type { CompletedMission } from 'src/hooks/quests/useCompletedMissions';
import { resolveStrapiMediaUrl } from 'src/utils/strapi/strapiHelper';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';
import {
  AchievementTile,
  TileContent,
  TileImage,
  TileImagePlaceholder,
} from './YourAchievementsSection.styles';

interface CompletedMissionCardProps {
  mission: CompletedMission;
}

export const CompletedMissionCard: FC<CompletedMissionCardProps> = ({
  mission,
}) => {
  const { t } = useTranslation();
  const { quest } = mission;
  const imageUrl = resolveStrapiMediaUrl(quest.Image?.url);
  const points = quest.Points ?? 0;

  return (
    <AchievementTile>
      {imageUrl ? (
        <TileImage src={imageUrl} alt={quest.Title} />
      ) : (
        <TileImagePlaceholder />
      )}
      <TileContent>
        <Typography
          variant="bodyMediumStrong"
          color="textPrimary"
          sx={getTextEllipsisStyles(2, 40)}
        >
          {quest.Title}
        </Typography>
        <Badge
          label={t('profile_page.yourAchievements.xpEarned', { xp: points })}
          variant={points > 0 ? BadgeVariant.Success : BadgeVariant.Alpha}
          size={BadgeSize.MD}
        />
      </TileContent>
    </AchievementTile>
  );
};
