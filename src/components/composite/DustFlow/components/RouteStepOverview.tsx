import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { ExternalLink } from '@/components/Link/ExternalLink';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import type { FC } from 'react';

type StepStatus = 'completed' | 'executing' | 'pending';

export interface RouteStepOverviewProps {
  label: string;
  status: StepStatus;
  explorerUrl?: string;
}

export const RouteStepOverview: FC<RouteStepOverviewProps> = ({
  label,
  status,
  explorerUrl,
}) => {
  return (
    <Badge
      variant={BadgeVariant.Alpha}
      size={BadgeSize.MD}
      sx={{ width: '100%', justifyContent: 'flex-start', gap: 1 }}
      startIcon={
        status === 'completed' ? (
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: (theme) => theme.shape.radiusRoundedFull,
              backgroundColor: (theme) =>
                (theme.vars || theme).palette.statusSuccessBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              '& svg': {
                height: 12,
                width: 12,
                color: (theme) => (theme.vars || theme).palette.statusSuccessFg,
              },
            }}
          >
            <CheckIcon />
          </Box>
        ) : (
          <CircularProgress
            size={16}
            color="inherit"
            enableTrackSlot
            variant={status === 'executing' ? 'indeterminate' : 'determinate'}
            sx={{ flexShrink: 0 }}
          />
        )
      }
      label={<Typography variant="bodyXXSmallStrong">{label}</Typography>}
      endIcon={
        explorerUrl ? (
          <ExternalLink
            href={explorerUrl}
            sx={{ marginLeft: 'auto', '& svg': { height: 12, width: 12 } }}
          />
        ) : undefined
      }
    />
  );
};
