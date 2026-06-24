import Box from '@mui/material/Box';
import { BadgeSize } from 'src/components/Badge/Badge.styles';
import { BadgeSkeleton } from 'src/components/Badge/BadgeSkeleton';
import {
  CarouselCardBadges,
  CarouselCardContainer,
  CarouselCardContent,
  CarouselCardHeader,
  CarouselCardMedia,
} from '@/components/Cards/CarouselCard/CarouselCard.styles';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

// Loading placeholder mirroring the mission carousel card shell (media + 2-line
// title + XP badge), so the skeleton matches the real card layout while the
// first page of missions loads.
export const MissionXpCardSkeleton = () => (
  <CarouselCardContainer>
    <CarouselCardMedia>
      <BaseSurfaceSkeleton
        variant="rounded"
        sx={(theme) => ({
          width: '100%',
          height: '100%',
          borderRadius: `${theme.shape.radius16}px`,
        })}
      />
    </CarouselCardMedia>
    <CarouselCardContent>
      <CarouselCardHeader>
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1),
            width: '100%',
          })}
        >
          <BaseSurfaceSkeleton
            variant="rounded"
            sx={(theme) => ({ width: '90%', height: theme.spacing(2) })}
          />
          <BaseSurfaceSkeleton
            variant="rounded"
            sx={(theme) => ({ width: '55%', height: theme.spacing(2) })}
          />
        </Box>
      </CarouselCardHeader>
      <CarouselCardBadges>
        <BadgeSkeleton size={BadgeSize.MD} width={96} />
      </CarouselCardBadges>
    </CarouselCardContent>
  </CarouselCardContainer>
);
