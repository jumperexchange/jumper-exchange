import { Badge, Tooltip } from '@mui/material';
import type { ExtraRewards } from '@/components/Berachain/BerachainType';
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
          Baffle rewards are additional rewards offered by participating
          applications exclusively to Jumper UI users. This rewards are specific
          NFTs that are distributed through raffle mechanisms at the end of the
          campaign to every user that deposit more than {'>'}$69 in the selected
          markets.
        </>
      }
      placement="top"
      enterTouchDelay={0}
      arrow
    >
      <Badge
        color="primary"
        badgeContent="baffle"
        sx={(theme) => ({
          cursor: 'help',
          '.MuiBadge-badge': {
            right: '25px',
            fontWeight: 700,
            lineHeight: '16px',
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
