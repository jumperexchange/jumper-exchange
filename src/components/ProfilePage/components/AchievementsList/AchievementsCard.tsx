import { format } from 'date-fns';
import { FC, useMemo } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from 'src/components/Badge/Badge.styles';
import { AchievementCard } from 'src/components/Cards/AchievementCard/AchievementCard';
import { PDA } from 'src/types/loyaltyPass';

interface AchievementsCardProps {
  pda: PDA;
}

export const AchievementsCard: FC<AchievementsCardProps> = ({ pda }) => {
  const { title, description, imageUrl, points } = useMemo(() => {
    return {
      title: pda.reward.name,
      description: format(pda.timestamp, `LLLL yyyy`),
      imageUrl: pda.reward.image,
      points: pda.points,
    };
  }, [JSON.stringify(pda)]);

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
    />
  );
};
