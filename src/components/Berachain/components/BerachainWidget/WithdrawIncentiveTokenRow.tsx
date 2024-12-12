import { Button, Typography } from '@mui/material';
import React from 'react';

export const WithdrawIncentiveTokenRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: any;
    disabled: boolean;
  }
>(({ className, token, disabled, ...props }, ref) => {
  return (
    <div
      ref={ref}
      // className={cn(
      ///*"flex w-full grow flex-row items-center justify-between gap-2",*/
      // className
      // )}
      {...props}
    >
      <div className="flex h-4 flex-row items-center space-x-2">
        <Typography>
          {Intl.NumberFormat('en-US', {
            style: 'decimal',
            notation: 'standard',
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          }).format(token.token_amount)}
        </Typography>
        TOKEN
        {/*<TokenDisplayer size={4} tokens={[token]} symbols={true} />*/}
      </div>
      <div className="w-24">
        <Button
          disabled={disabled}
          onClick={(e) => props.onClick?.(e as any)}
          className="py-1 text-sm"
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
});
