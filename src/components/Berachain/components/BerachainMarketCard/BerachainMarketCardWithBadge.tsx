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
    <Tooltip
      title={
        <>
          {`Baffle rewards are additional rewards offered by participating applications exclusively to users who deposit into Boyco via Jumper. These rewards are Berachain ecosystem NFTs that will be distributed through raffle mechanisms. To enter the raffle you must deposit more than $69 into any pool of the protocol. Known rewards: 25 HJ1 NFTs, 5 Big Fat Beras NFTs, 5 Beary Benslers NFTs, 1 Bearet Yellens NFT...`}
        </>
      }
      placement="top"
      enterTouchDelay={0}
      arrow
    >
      <Badge
        color="primary"
        badgeContent={
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
    </Tooltip>
  );
};
