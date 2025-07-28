import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';
import {
  BaseSkeleton,
  PerksCardActionArea,
  PerksCardBadgeContainer,
  PerksCardContainer,
  PerksCardContent,
  PerksCardImage,
} from './PerksCard.style';
import { PerksCardSkeleton } from './PerksCardSkeleton';
import { PERK_CARD_SIZES } from './constants';
interface PerksCardProps {
  title: string;
  description: string;
  imageUrl: string;
  levelBadge: ReactNode;
  perksBadge?: ReactNode;
  isLoading?: boolean;
}

export const PerksCard = ({
  title,
  description,
  imageUrl,
  levelBadge,
  perksBadge,
  isLoading,
}: PerksCardProps) => {
  if (isLoading) {
    return <PerksCardSkeleton />;
  }

  return (
    <PerksCardContainer>
      <PerksCardActionArea disableRipple>
        {imageUrl ? (
          <PerksCardImage
            src={imageUrl}
            alt={`achievement-card-${title}`}
            width={PERK_CARD_SIZES.CARD_WIDTH}
            height={PERK_CARD_SIZES.IMAGE_HEIGHT}
          />
        ) : (
          <BaseSkeleton
            variant="rectangular"
            width={'100%'}
            height={PERK_CARD_SIZES.IMAGE_HEIGHT}
          />
        )}
        <PerksCardContent>
          <Typography variant="bodyLargeStrong" sx={getTextEllipsisStyles(1)}>
            {title}
          </Typography>
          <Typography
            variant="bodySmall"
            sx={(theme) => ({
              color: (theme.vars || theme).palette.text.secondary,
              ...getTextEllipsisStyles(3, 60), // 60px max height, 3 lines
            })}
          >
            {description}
          </Typography>
          <PerksCardBadgeContainer>
            {perksBadge}
            {levelBadge}
          </PerksCardBadgeContainer>
        </PerksCardContent>
      </PerksCardActionArea>
    </PerksCardContainer>
  );
};
