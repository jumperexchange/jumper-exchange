import type { CSSObject } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { SpotButton as SpotButtonStyled } from './SpotButton.style';

interface SpotButtonProps {
  name?: string;
  variant?: string;
  onClick: any;
  children: ReactNode;
  style?: CSSObject;
}

export const SpotButton = ({
  children,
  name,
  variant,
  onClick,
  style,
}: SpotButtonProps) => {
  const theme = useTheme();
  return (
    <Box textAlign={'center'} sx={{ ...style }}>
      <SpotButtonStyled variant={variant} onClick={onClick}>
        {children}
      </SpotButtonStyled>
      {!!name ? (
        <Typography
          mt={theme.spacing(2)}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '75%',
            margin: '8px auto 0',
          }}
          variant={'lifiBodyXSmallStrong'}
        >
          {name}
        </Typography>
      ) : null}
    </Box>
  );
};
