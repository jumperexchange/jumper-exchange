import Box from '@mui/material/Box';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { BadgeSize } from 'src/components/Badge/Badge.styles';
import { BadgeSkeleton } from 'src/components/Badge/BadgeSkeleton';
import { AchievementTile, TileContent } from '../Section.style';

// Loading placeholder mirroring the achievement tile shell (image + title +
// badge), so the skeleton grid matches the real card layout while data loads.
export const AchievementCardSkeleton = () => (
  <AchievementTile>
    <BaseSurfaceSkeleton
      variant="rounded"
      sx={(theme) => ({
        width: '100%',
        height: theme.spacing(14),
        borderRadius: `${theme.shape.radius16}px`,
      })}
    />
    <TileContent>
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
      <BadgeSkeleton size={BadgeSize.MD} width={96} />
    </TileContent>
  </AchievementTile>
);
