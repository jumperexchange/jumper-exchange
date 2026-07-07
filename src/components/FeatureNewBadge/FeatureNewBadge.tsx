import type { SxProps, Theme } from '@mui/material/styles';
import type { FC } from 'react';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { mergeSx } from '@/utils/theme/mergeSx';

export type BadgePlacement =
  | 'inline'
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export interface FeatureNewBadgeProps {
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  placement?: BadgePlacement;
  /** px offset from the edge for non-inline placements. Default: -8 */
  offset?: number;
  sx?: SxProps<Theme>;
}

function placementSx(
  placement: BadgePlacement,
  offset: number,
): SxProps<Theme> {
  if (placement === 'inline') {
    return {};
  }
  const edge = offset;
  const base: SxProps<Theme> = { position: 'absolute', zIndex: 1 };
  switch (placement) {
    case 'top-right':
      return { ...base, top: edge, right: edge };
    case 'top-left':
      return { ...base, top: edge, left: edge };
    case 'bottom-right':
      return { ...base, bottom: edge, right: edge };
    case 'bottom-left':
      return { ...base, bottom: edge, left: edge };
  }
}

export const FeatureNewBadge: FC<FeatureNewBadgeProps> = ({
  label = 'NEW',
  variant = BadgeVariant.Error,
  size = BadgeSize.SM,
  placement = 'inline',
  offset = -8,
  sx,
}) => {
  return (
    <Badge
      label={label}
      variant={variant}
      size={size}
      sx={mergeSx(
        placementSx(placement, offset),
        sx,
        variant === BadgeVariant.New
          ? {
              paddingX: 0.75,
              '& > p': {
                fontFamily: '-apple-system, Helvetica, Arial, sans-serif',
              },
            }
          : {},
      )}
    />
  );
};
