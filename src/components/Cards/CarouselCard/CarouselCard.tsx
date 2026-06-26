import Typography from '@mui/material/Typography';
import type { FC, ReactNode } from 'react';
import { getTextEllipsisStyles } from '@/utils/styles/getTextEllipsisStyles';
import {
  CarouselCardBadges,
  CarouselCardContainer,
  CarouselCardContent,
  CarouselCardHeader,
  CarouselCardImage,
  CarouselCardImagePlaceholder,
  CarouselCardMedia,
  CarouselCardMediaOverlay,
} from './CarouselCard.styles';

interface CarouselCardProps {
  title: string;
  /** Badge row pinned to the bottom of the card. */
  badges: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  /** Optional secondary line under the title. */
  description?: string;
  /** Lines the title clamps to before truncating. Defaults to a single line. */
  titleLines?: number;
  /** Dims the media (e.g. locked / claimed perks). */
  dimmed?: boolean;
  /** Overlay anchored to the bottom-left of the media, e.g. a chain avatar. */
  mediaOverlay?: ReactNode;
}

const dimmedImageSx = { filter: 'brightness(0.65)' } as const;
// Clamp height (px) for the 2-line title variant; matches the 20px line-height.
const MULTILINE_TITLE_MAX_HEIGHT = 40;

/**
 * Shared presentational card for the profile section carousels: media on top,
 * a title (+ optional description), and a badge row pinned to the bottom.
 * Feature wrappers (PerkCard, MissionXpCard) map their data onto it.
 */
export const CarouselCard: FC<CarouselCardProps> = ({
  title,
  badges,
  imageUrl,
  imageAlt,
  description,
  titleLines = 1,
  dimmed = false,
  mediaOverlay,
}) => (
  <CarouselCardContainer>
    <CarouselCardMedia>
      {imageUrl ? (
        <CarouselCardImage
          src={imageUrl}
          alt={imageAlt ?? title}
          sx={dimmed ? dimmedImageSx : undefined}
        />
      ) : (
        <CarouselCardImagePlaceholder sx={dimmed ? dimmedImageSx : undefined} />
      )}
      {mediaOverlay ? (
        <CarouselCardMediaOverlay>{mediaOverlay}</CarouselCardMediaOverlay>
      ) : null}
    </CarouselCardMedia>
    <CarouselCardContent>
      <CarouselCardHeader>
        <Typography
          variant="bodyMediumStrong"
          color="textPrimary"
          sx={getTextEllipsisStyles(titleLines, MULTILINE_TITLE_MAX_HEIGHT)}
        >
          {title}
        </Typography>
        {description ? (
          <Typography
            variant="bodyXSmall"
            color="textSecondary"
            sx={getTextEllipsisStyles(2, 32)}
          >
            {description}
          </Typography>
        ) : null}
      </CarouselCardHeader>
      <CarouselCardBadges>{badges}</CarouselCardBadges>
    </CarouselCardContent>
  </CarouselCardContainer>
);
