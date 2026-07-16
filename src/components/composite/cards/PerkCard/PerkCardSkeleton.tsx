import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { BadgeSize } from '@/components/Badge/Badge.styles';
import { BadgeSkeleton } from '@/components/Badge/BadgeSkeleton';
import {
  CarouselCardBadges,
  CarouselCardContainer,
  CarouselCardContent,
  CarouselCardHeader,
  CarouselCardMedia,
} from '@/components/Cards/CarouselCard/CarouselCard.styles';

// Loading placeholder mirroring the perk card shell (media + title +
// description + benefit/status badges), so the skeleton grid matches the real
// card layout while data loads.
export const PerkCardSkeleton = () => (
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
        <BaseSurfaceSkeleton
          variant="rounded"
          sx={(theme) => ({ width: '60%', height: theme.spacing(2.5) })}
        />
        <BaseSurfaceSkeleton
          variant="rounded"
          sx={(theme) => ({ width: '100%', height: theme.spacing(2) })}
        />
        <BaseSurfaceSkeleton
          variant="rounded"
          sx={(theme) => ({ width: '80%', height: theme.spacing(2) })}
        />
      </CarouselCardHeader>
      <CarouselCardBadges>
        <BadgeSkeleton size={BadgeSize.MD} width={64} />
        <BadgeSkeleton size={BadgeSize.MD} width={80} />
      </CarouselCardBadges>
    </CarouselCardContent>
  </CarouselCardContainer>
);
