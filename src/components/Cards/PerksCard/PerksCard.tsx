import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { multilineEllipsis, singleLineEllipsis } from 'src/utils/textEllipsis';
import {
  PerksCardActionArea,
  PerksCardBadgeContainer,
  PerksCardContainer,
  PerksCardContent,
  PerksCardImage,
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
          <Typography variant="bodyLargeStrong" sx={singleLineEllipsis}>
            {title}
          </Typography>
          <Typography
            variant="bodySmall"
            sx={(theme) => ({
              color: (theme.vars || theme).palette.text.secondary,
              ...multilineEllipsis(60, 3), // 60px max height, 3 lines
            })}
          >
            {description}
          </Typography>
          {badge && <PerksCardBadgeContainer>{badge}</PerksCardBadgeContainer>}
        </PerksCardContent>
      </PerksCardActionArea>
    </PerksCardContainer>
  );
};
