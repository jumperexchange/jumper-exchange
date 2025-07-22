import { FC, useContext } from 'react';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { ProfileContext } from 'src/providers/ProfileProvider';
import {
  LevelCardContainer,
  LevelCardContentContainer,
  LevelGroupContainer,
  LevelProgressContainer,
} from './LevelCard.style';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { ProgressionBar } from '../../LevelBox/ProgressionBar';
import { getLevelBasedOnPoints } from '../../utils/getLevelBasedOnPoints';
import { PointsDisplay } from '../../LevelBox/PointsDisplay';
import { CardBadgeHeader } from '../CardBadgeHeader/CardBadgeHeader';
import { useTranslation } from 'react-i18next';
import { LevelCardSkeleton } from './LevelCardSkeleton';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';

interface LevelCardProps {}

export const LevelCard: FC<LevelCardProps> = () => {
  const { walletAddress, isLoading: isWalletLoading } =
    useContext(ProfileContext);
  const { isLoading, points = 0 } = useLoyaltyPass(walletAddress);
  const levelData = getLevelBasedOnPoints(points);
  const currentLevel = levelData.level ?? 0;
  const { t } = useTranslation();

  if (isWalletLoading || isLoading) {
    return <LevelCardSkeleton />;
  }

  return (
    <LevelCardContainer>
      <SectionCard>
        <LevelCardContentContainer>
          <CardBadgeHeader
            tooltip={t('profile_page.levelInfo')}
            label={t('profile_page.level')}
          />

          <LevelGroupContainer>
            <PointsDisplay points={currentLevel} />
            <PointsDisplay points={currentLevel + 1} />
          </LevelGroupContainer>
          <LevelProgressContainer>
            <ProgressionBar
              ongoingValue={points}
              levelData={levelData}
              loading={isLoading}
              hideLevelIndicator
            />

            <Badge
              label={`${points} XP`}
              variant={BadgeVariant.Secondary}
              size={BadgeSize.MD}
            />
          </LevelProgressContainer>
        </LevelCardContentContainer>
      </SectionCard>
    </LevelCardContainer>
  );
};
