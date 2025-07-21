import { ReactNode } from 'react';
import {
  AchievementCardActionArea,
  AchievementCardContainer,
  AchievementCardContent,
  AchievementCardLabel,
  AchievementCardTypography,
  BaseSkeleton,
  StyledAchievementCardImage,
} from './AchievementCard.style';
import { AchievementCardSkeleton } from './AchievementCardSkeleton';
interface AchievementCardProps {
  title: string;
  description: string;
  imageUrl: string;
  badge?: ReactNode;
  isLoading?: boolean;
}

export const AchievementCard = ({
  title,
  description,
  imageUrl,
  badge,
  isLoading,
}: AchievementCardProps) => {
  if (isLoading) {
    return <AchievementCardSkeleton />;
  }

  return (
    <AchievementCardContainer>
      <AchievementCardActionArea focusRipple={false} disabled>
        {imageUrl ? (
          <StyledAchievementCardImage
            src={imageUrl}
            alt={`Image for ${title}`}
            // For a next/image we need to set height/width
            height={320}
            width={320}
            // @Note need to add priority to the first loaded items as LCP is impacted
          />
        ) : (
          <BaseSkeleton
            animation={false}
            variant="rectangular"
            sx={{
              height: 320,
              width: '100%',
            }}
          />
        )}
        <AchievementCardContent>
          <AchievementCardLabel>
            <AchievementCardTypography variant="bodyLargeStrong">
              {title}
            </AchievementCardTypography>
            <AchievementCardTypography
              variant="bodySmall"
              sx={(theme) => ({
                color: (theme.vars || theme).palette.text.secondary, // @todo: wrong alpha color
              })}
            >
              {description}
            </AchievementCardTypography>
          </AchievementCardLabel>
          {badge}
        </AchievementCardContent>
      </AchievementCardActionArea>
    </AchievementCardContainer>
  );
};
