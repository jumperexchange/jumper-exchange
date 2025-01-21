import { Badge, Tooltip } from '@mui/material';
import type { ExtraRewards } from '@/components/Berachain/BerachainType';
import React from 'react';

interface BerachainMarketCardWithBadgeProps {
  extraRewards: ExtraRewards;
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
        badgeContent="BAFFLE"
        sx={(theme) => ({
          cursor: 'help',
          '.MuiBadge-badge': {
            color: theme.palette.black.main,
          },
        })}
      >
        {children}
      </Badge>
    </Tooltip>
  );
};
