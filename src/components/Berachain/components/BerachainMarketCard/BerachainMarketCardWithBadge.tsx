import { Badge, Box, Tooltip, Typography } from '@mui/material';
import type { ExtraRewards } from '@/components/Berachain/BerachainType';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import React from 'react';

interface BerachainMarketCardWithBadgeProps {
  extraRewards?: ExtraRewards;
  children: React.ReactNode;
}

export const BerachainMarketCardWithBadge = ({
  extraRewards,
  children,
}: BerachainMarketCardWithBadgeProps) => {
  if (!extraRewards) {
    return children;
  }

  return (
    <Badge
      color="primary"
      badgeContent={
        <Tooltip
          title={
            <>
              {`Baffle rewards are additional raffle rewards on top of the Boyco rewards offered by participating protocols exclusively to users who deposit into Boyco via Jumper. The rewards will be distributed through a raffle mechanism at the end of Boyco. To qualify for a protocols baffle you need to deposit and lock the minimum amount into any of their markets. More details about the rewards and how to qualify can be found in the market’s description.`}
            </>
          }
          placement="top"
          enterTouchDelay={0}
          arrow
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
            <AutoAwesomeIcon
              sx={{ width: '16px', height: '16px', color: '#00000' }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                lineHeight: '16px',
              }}
            >
              Baffle
            </Typography>
          </Box>
        </Tooltip>
      }
      sx={(theme) => ({
        cursor: 'help',
        '.MuiBadge-badge': {
          right: '25px',
          borderRadius: '128px',
          color: theme.palette.black.main,
          paddingX: theme.spacing(1.75),
          paddingY: theme.spacing(2),
        },
      })}
    >
      {children}
    </Badge>
  );
};
