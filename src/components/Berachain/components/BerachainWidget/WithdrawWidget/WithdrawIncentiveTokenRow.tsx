import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import TokenImage from '@/components/Portfolio/TokenImage';

export const WithdrawIncentiveTokenRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: any;
    disabled: boolean;
  }
>(({ className, token, disabled, ...props }, ref) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      ref={ref}
      sx={{
        cursor: 'pointer',
      }}
      // className={cn(
      ///*"flex w-full grow flex-row items-center justify-between gap-2",*/
      // className
      // )}
      {...props}
    >
      <Box
        sx={{
          display: 'flex', // Equivalent to `flex`
          flexDirection: 'row', // Equivalent to `flex-row`
          alignItems: 'center', // Equivalent to `items-center`
          gap: 2, // Equivalent to `space-x-2` (MUI uses theme-based spacing; `2` = 2 * 8px = 16px)
          whiteSpace: 'nowrap', // Equivalent to `whitespace-nowrap`
          wordBreak: 'normal', // Equivalent to `break-normal`
        }}
        // className="flex h-4 flex-row items-center space-x-2"
      >
        <Typography variant="body2" color="textSecondary">
          <WalletCardBadge
            sx={{ marginRight: '10px' }}
            overlap="circular"
            className="badge"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <WalletAvatar component="span">
              <TokenImage
                token={{
                  name: token.symbol,
                  logoURI: token.image,
                }}
              />
            </WalletAvatar>
          </WalletCardBadge>
          {Intl.NumberFormat('en-US', {
            style: 'decimal',
            notation: 'standard',
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          }).format(token.token_amount)}
        </Typography>
      </Box>
    </Box>
  );
});
