import { alpha, IconButton } from '@mui/material';
import React from 'react';

interface TotalBalanceIconButtonProps {
  refetch: () => void;
  children: JSX.Element | JSX.Element[];
}

// Using React.forwardRef to forward props and ref
const TotalBalanceIconButton = React.forwardRef<
  HTMLButtonElement,
  TotalBalanceIconButtonProps
>(({ refetch, children, ...props }, ref) => {
  return (
    <IconButton
      size="medium"
      aria-label="Refresh"
      sx={(theme) => ({
        marginRight: 1,
        '&:hover': {
          backgroundColor: alpha(theme.palette.text.primary, 0.08),
        },
      })}
      onClick={refetch}
      ref={ref} // Forwarding the ref here
      {...props} // Spreading other props to IconButton
    >
      {children}
    </IconButton>
  );
});

export default TotalBalanceIconButton;
