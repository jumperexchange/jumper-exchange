import { Badge, Box, Tooltip, Typography } from '@mui/material';
import type { ExtraRewards } from '@/components/Berachain/BerachainType';
import React from 'react';
import SvgIcon from '@mui/material/SvgIcon/SvgIcon';

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
            <SvgIcon sx={{ width: '16px', height: '16px', color: '#00000' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 7H18.791C18.9364 6.51351 19.0069 6.00771 19 5.5C19 3.57 17.43 2 15.5 2C13.878 2 12.795 3.482 12.096 5.085C11.407 3.57 10.269 2 8.5 2C6.57 2 5 3.57 5 5.5C5 6.096 5.079 6.589 5.209 7L4 7C2.897 7 2 7.897 2 9L2 11C2 12.103 2.897 13 4 13L4 20C4 21.103 4.897 22 6 22L18 22C19.103 22 20 21.103 20 20L20 13C21.103 13 22 12.103 22 11V9C22 7.897 21.103 7 20 7ZM15.5 4C16.327 4 17 4.673 17 5.5C17 7 16.374 7 16 7L13.522 7C14.033 5.424 14.775 4 15.5 4ZM7 5.5C7 4.673 7.673 4 8.5 4C9.388 4 10.214 5.525 10.698 7L8 7C7.626 7 7 7 7 5.5ZM4 9L11 9V11L4 11L4 9ZM6 20L6 13L11 13L11 20H6ZM18 20L13 20L13 13H18L18 20ZM13 11V9.085L13.017 9L20 9L20.001 11L13 11Z"
                  fill="black"
                  fill-opacity="0.84"
                />
              </svg>
            </SvgIcon>
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
