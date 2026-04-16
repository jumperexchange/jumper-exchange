import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { format } from 'date-fns';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from 'src/components/Badge/Badge.styles';
import { AchievementCard } from 'src/components/Cards/AchievementCard/AchievementCard';
import type { PDA } from 'src/types/loyaltyPass';

interface AchievementsCardProps {
  pda: PDA;
}

export const AchievementsCard: FC<AchievementsCardProps> = ({ pda }) => {
  const { t } = useTranslation();
  const { title, description, imageUrl, points, showHeaderBadge } =
    useMemo(() => {
      return {
        title: pda.reward.name,
        description: format(pda.timestamp, `LLLL yyyy`),
        imageUrl: pda.reward.image,
        points: pda.points,
        showHeaderBadge: !!pda.ongoing,
      };
    }, [pda]);

  return (
    <AchievementCard
      title={title}
      description={description}
      imageUrl={imageUrl}
      badge={
        <Badge
          label={`${points} XP`}
          variant={BadgeVariant.Alpha}
          size={BadgeSize.MD}
        />
      }
      headerBadge={
        showHeaderBadge ? (
          <Tooltip
            title={t('profile_page.tooltips.ongoingAchievement')}
            arrow
            placement="top"
            enterDelay={100}
            disableTouchListener={false}
            enterTouchDelay={0}
            leaveTouchDelay={2000}
            slotProps={{
              tooltip: {
                sx: {
                  color: (theme) =>
                    (theme.vars || theme).palette.textPrimaryInverted,
                  backgroundColor: (theme) =>
                    (theme.vars || theme).palette.grey[900],
                  '& .MuiTooltip-arrow': {
                    color: (theme) => (theme.vars || theme).palette.grey[900],
                  },
                },
              },
            }}
          >
            <span>
              <Badge
                label={t('profile_page.ongoing')}
                variant={BadgeVariant.Success}
                size={BadgeSize.MD}
              />
            </span>
          </Tooltip>
        ) : undefined
      }
    />
  );
};
