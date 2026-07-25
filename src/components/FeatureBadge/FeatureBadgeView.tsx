import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { FC } from 'react';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant } from '@/components/Badge/Badge.styles';
import { useFeatureBadgeDisplay } from '@/hooks/featureBadge/useFeatureBadgeDisplay';
import type { FeatureBadgeData } from '@/types/strapi';
import { mergeSx } from '@/utils/theme/mergeSx';

interface FeatureBadgeOverride {
  label: string;
  variant?: BadgeVariant;
}

interface FeatureBadgeViewProps {
  featureBadge: FeatureBadgeData;
  referenceDate?: string | null;
  defaultLabel?: string;
  override?: FeatureBadgeOverride;
  sx?: SxProps<Theme>;
}

export const FeatureBadgeView: FC<FeatureBadgeViewProps> = ({
  featureBadge,
  referenceDate,
  defaultLabel,
  override,
  sx,
}) => {
  const { isVisible, label, variant, size, iconUrl } = useFeatureBadgeDisplay({
    enabled: featureBadge.Enabled,
    launchAt: featureBadge.LaunchAt,
    expiryMode: featureBadge.ExpiryMode,
    expiresAt: featureBadge.ExpiresAt,
    displayDaysAfterLaunch: featureBadge.DisplayDaysAfterLaunch,
    liveBadge: featureBadge.LiveBadge,
    soonBadge: featureBadge.SoonBadge,
    referenceDate,
    defaultLabel,
  });

  if (!isVisible) {
    return null;
  }

  const displayLabel = override?.label ?? label;
  const displayVariant = override?.variant ?? variant;

  return (
    <Badge
      label={displayLabel}
      variant={displayVariant}
      size={size}
      startIcon={
        iconUrl ? (
          <Box
            component="img"
            src={iconUrl}
            alt=""
            sx={{ width: 16, height: 16, objectFit: 'contain' }}
          />
        ) : undefined
      }
      sx={mergeSx(
        sx,
        displayVariant === BadgeVariant.New
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
