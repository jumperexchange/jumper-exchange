import { ReactNode } from 'react';
import {
  AchievementCardActionArea,
  AchievementCardContainer,
  AchievementCardContent,
  AchievementCardImage,
  AchievementCardLabel,
  AchievementCardTypography,
} from './AchievementCard.style';
interface AchievementCardProps {
  title: string;
  description: string;
  image: string;
  badge?: ReactNode;
}

export const AchievementCard = ({
  title,
  description,
  image,
  badge,
}: AchievementCardProps) => {
  return (
    <AchievementCardContainer>
      <AchievementCardActionArea disableRipple>
        <AchievementCardImage
          src={image}
          alt={`achievement-card-${title}`}
          width={320}
          height={320}
        />
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
