'use client';

import Box from '@mui/material/Box';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { CarouselCard } from '@/components/Cards/CarouselCard/CarouselCard';
import { EntityAvatar } from '@/components/composite/EntityAvatar/EntityAvatar';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { Link } from '@/components/Link/Link';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useFormatDisplayQuestData } from '@/hooks/quests/useFormatDisplayQuestData';
import { useMissionTimeStatus } from '@/hooks/useMissionTimeStatus';
import { useUserTracking } from '@/hooks/userTracking';
import type { QuestData, StrapiResponseData } from '@/types/strapi';

interface MissionXpCardProps {
  mission: StrapiResponseData<QuestData>[number];
}

export const MissionXpCard: FC<MissionXpCardProps> = ({ mission }) => {
  const { t } = useTranslation();
  const missionDisplayData = useFormatDisplayQuestData(mission, {
    useBannerImage: false,
    preferExtraWideImage: true,
  });
  const { isDisabled } = useMissionTimeStatus(
    mission.StartDate,
    mission.EndDate,
    mission.hasEnded,
  );
  const { trackEvent } = useUserTracking();

  const isMissionDisabled = isDisabled || !missionDisplayData.href;
  const chain = missionDisplayData.participants?.[0];
  const xpReward = missionDisplayData.rewardGroups?.xp?.[0];

  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickQuestCard,
      label: 'click-quest-card',
      data: {
        [TrackingEventParameter.QuestCardTitle]: missionDisplayData.title || '',
        [TrackingEventParameter.QuestCardId]: missionDisplayData.id || '',
      },
    });
  };

  const card = (
    <CarouselCard
      title={missionDisplayData.title}
      titleLines={2}
      imageUrl={missionDisplayData.imageUrl}
      mediaOverlay={
        chain && chain.id ? (
          <Box
            sx={(theme) => ({
              display: 'flex',
              borderRadius: theme.shape.radiusRoundedFull,
              border: `2px solid ${(theme.vars || theme).palette.surface1.main}`,
            })}
          >
            <EntityAvatar
              entity={{ chainId: chain.id, chainKey: chain.label ?? '' }}
              size={AvatarSize.MD}
            />
          </Box>
        ) : undefined
      }
      badges={
        xpReward ? (
          <Badge
            label={t('profile_page.earnXp.xpAvailable', { xp: xpReward.value })}
            variant={BadgeVariant.Alpha}
            size={BadgeSize.MD}
          />
        ) : null
      }
    />
  );

  return !isMissionDisabled ? (
    <Link
      href={missionDisplayData.href}
      onClick={handleClick}
      sx={{ textDecoration: 'none', width: '100%' }}
    >
      {card}
    </Link>
  ) : (
    card
  );
};
