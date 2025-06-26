'use client';

import { FC, useMemo } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { EntityCard } from 'src/components/Cards/EntityCard/EntityCard';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useMissionTimeStatus } from 'src/hooks/useMissionTimeStatus';
import { useUserTracking } from 'src/hooks/userTracking';
import { QuestData, StrapiResponseData } from 'src/types/strapi';
import { useFormatDisplayMissionData } from './hooks';
import { Link } from 'src/components/Link';

interface MissionCardProps {
  mission: StrapiResponseData<QuestData>[number];
}

export const MissionCard: FC<MissionCardProps> = ({ mission }) => {
  const missionDisplayData = useFormatDisplayMissionData(mission);
  const status = useMissionTimeStatus(mission.StartDate, mission.EndDate);

  const badge = useMemo(() => {
    if (!status) {
      return null;
    }
    return <Badge label={status} variant="secondary" />;
  }, [status]);

  const { trackEvent } = useUserTracking();

  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickQuestCard,
      label: 'click-quest-card',
      data: {
        [TrackingEventParameter.QuestCardTitle]: missionDisplayData.title || '',
        [TrackingEventParameter.QuestCardLabel]: '',
        [TrackingEventParameter.QuestCardId]: missionDisplayData.id || '',
        // [TrackingEventParameter.QuestCardPlatform]: platformName || '',
      },
    });
  };

  return (
    <Link
      href={missionDisplayData.href}
      sx={{
        textDecoration: 'none',
        width: 'fit-content',
        justifySelf: 'center',
        alignSelf: 'center',
      }}
    >
      <EntityCard
        variant="compact"
        badge={badge}
        id={missionDisplayData.id}
        slug={missionDisplayData.slug}
        title={missionDisplayData.title}
        participants={missionDisplayData.participants}
        imageUrl={missionDisplayData.imageUrl}
        rewardGroups={missionDisplayData.rewardGroups}
        onClick={handleClick}
      />
    </Link>
  );
};
