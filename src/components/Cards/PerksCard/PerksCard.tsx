import { ReactNode } from 'react';
import {
  PerksCardActionArea,
  PerksCardBadgeContainer,
  PerksCardContainer,
  PerksCardContent,
  PerksCardImage,
  PerksCardTypography,
} from './PerksCard.style';
interface PerksCardProps {
  title: string;
  description: string;
  image: string;
  badge?: ReactNode;
}

export const PerksCard = ({
  title,
  description,
  image,
  badge,
}: PerksCardProps) => {
  return (
    <PerksCardContainer>
      <PerksCardActionArea disableRipple>
        <PerksCardImage
          src={image}
          alt={`achievement-card-${title}`}
          width={296}
          height={192}
        />
        <PerksCardContent>
          <PerksCardTypography variant="bodyLargeStrong">
            {title}
          </PerksCardTypography>
          <PerksCardTypography
            variant="bodySmall"
            sx={(theme) => ({
              maxHeight: 60,
              color: (theme.vars || theme).palette.text.secondary, // @todo: wrong alpha color
            })}
          >
            {description}
          </PerksCardTypography>
          {badge && <PerksCardBadgeContainer>{badge}</PerksCardBadgeContainer>}
        </PerksCardContent>
      </PerksCardActionArea>
    </PerksCardContainer>
  );
};
