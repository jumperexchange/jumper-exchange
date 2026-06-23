import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { ProgressRing } from '@/components/core/ProgressRing/ProgressRing';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import type { ActivityRewardType } from 'src/hooks/achievements/useActivityRewards';
import type { OngoingActivity } from 'src/hooks/achievements/useOngoingActivity';
import { formatDateLocalized } from 'src/utils/formatDateLocalized';
import {
  AchievementTile,
  TileContent,
  TileFooterRow,
  TileHeaderGroup,
  TileHeaderRow,
  TileImage,
  TileImagePlaceholder,
} from '../Section.style';

interface OngoingActivityCardProps {
  activity: OngoingActivity;
  // The category artwork of the latest settled month, used while the running
  // month has no reward entity (and therefore no image) yet.
  fallbackImageUrl?: string;
}

const TYPE_KEYS = {
  swap_oor: 'profile_page.earnXp.activity.types.swap_oor',
  earn_oor: 'profile_page.earnXp.activity.types.earn_oor',
  bridge_oor: 'profile_page.earnXp.activity.types.bridge_oor',
  chain_oor: 'profile_page.earnXp.activity.types.chain_oor',
} as const satisfies Record<ActivityRewardType, string>;

const PROGRESS_KEYS = {
  swap_oor: 'profile_page.earnXp.activity.progress.swap_oor',
  earn_oor: 'profile_page.earnXp.activity.progress.earn_oor',
  bridge_oor: 'profile_page.earnXp.activity.progress.bridge_oor',
  chain_oor: 'profile_page.earnXp.activity.progress.chain_oor',
} as const satisfies Record<ActivityRewardType, string>;

const NEXT_TIER_KEYS = {
  swap_oor: 'profile_page.earnXp.activity.nextTier.swap_oor',
  earn_oor: 'profile_page.earnXp.activity.nextTier.earn_oor',
  bridge_oor: 'profile_page.earnXp.activity.nextTier.bridge_oor',
  chain_oor: 'profile_page.earnXp.activity.nextTier.chain_oor',
} as const satisfies Record<ActivityRewardType, string>;

export const OngoingActivityCard: FC<OngoingActivityCardProps> = ({
  activity,
  fallbackImageUrl,
}) => {
  const { t } = useTranslation();
  const title = t(TYPE_KEYS[activity.type]);
  const imageUrl = activity.image || fallbackImageUrl;
  const ringLabel = activity.isTopTier
    ? t('profile_page.earnXp.activity.topTier')
    : t(NEXT_TIER_KEYS[activity.type], {
        count: activity.amountToNextTier,
        xp: activity.nextTierXP,
      });

  return (
    <AchievementTile>
      {imageUrl ? (
        <TileImage src={imageUrl} alt={title} />
      ) : (
        <TileImagePlaceholder />
      )}
      <TileContent>
        <TileHeaderGroup>
          <TileHeaderRow>
            <Typography variant="bodyMediumStrong" color="textPrimary" noWrap>
              {title}
            </Typography>
            <Badge
              label={formatDateLocalized(new Date(), 'MMMM yyyy')}
              variant={BadgeVariant.Alpha}
              size={BadgeSize.SM}
            />
          </TileHeaderRow>
          <Typography variant="bodyXSmall" color="textSecondary">
            {t(PROGRESS_KEYS[activity.type], { count: activity.currentValue })}
          </Typography>
        </TileHeaderGroup>
        <TileFooterRow>
          <Badge
            label={t('profile_page.earnXp.activity.xpAvailable', {
              xp: activity.availableXP,
            })}
            variant={BadgeVariant.Alpha}
            size={BadgeSize.MD}
          />
          <Tooltip title={ringLabel} arrow placement="top">
            <ProgressRing
              progress={activity.progress}
              sx={(theme) => ({
                color: (theme.vars || theme).palette.statusSuccessFg,
              })}
            />
          </Tooltip>
        </TileFooterRow>
      </TileContent>
    </AchievementTile>
  );
};
