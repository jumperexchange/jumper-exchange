import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import TokenImage from '@/components/Portfolio/TokenImage';

export const WithdrawInputTokenRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: any;
    tokenValueUSD?: string;
  }
>(({ className, token, tokenValueUSD, ...props }, ref) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="row"
      ref={ref}
      // className={cn("flex w-full flex-row", className)}
      {...props}
    >
      <Box
        sx={{
          display: 'flex', // Equivalent to `flex`
          flexDirection: 'row', // Equivalent to `flex-row`
          alignItems: 'center', // Equivalent to `items-center`
          whiteSpace: 'nowrap', // Equivalent to `whitespace-nowrap`
          wordBreak: 'normal', // Equivalent to `break-normal`
        }}
        // className="flex flex-row items-center space-x-2 whitespace-nowrap break-normal"
      >
        <WalletCardBadge
          sx={{ marginRight: '8px' }}
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="bodyMediumStrong"
            color={theme.palette.text.primary}
          >
            {Intl.NumberFormat('en-US', {
              style: 'decimal',
              notation: 'standard',
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 5,
            }).format(token.token_amount)}
          </Typography>
          <Typography variant="bodyXSmall" color="textSecondary">
            {tokenValueUSD}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});
