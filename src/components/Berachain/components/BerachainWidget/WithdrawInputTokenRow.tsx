import { Typography } from '@mui/material';
import React from 'react';

export const WithdrawInputTokenRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: any;
  }
>(({ className, token, ...props }, ref) => {
  return (
    <div
      ref={ref}
      // className={cn("flex w-full flex-row", className)}
      {...props}
    >
      <div className="flex flex-row items-center space-x-2 whitespace-nowrap break-normal">
        <Typography className="h-4">
          {Intl.NumberFormat('en-US', {
            style: 'decimal',
            notation: 'standard',
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          }).format(token.token_amount)}
        </Typography>
        Display token
        {/*<TokenDisplayer size={4} tokens={[token]} symbols={true} />*/}
      </div>
    </div>
  );
});
