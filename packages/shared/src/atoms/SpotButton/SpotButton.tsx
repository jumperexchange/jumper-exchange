import type { CSSObject } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { SpotButton as SpotButtonStyled } from './SpotButton.style';

interface SpotButtonProps {
  name?: string;
  variant?: string;
  onClick: any;
  children: ReactNode;
  styles?: CSSObject;
}

export const SpotButton = ({
  children,
  name,
  variant,
  onClick,
  styles,
}: SpotButtonProps) => {
  const theme = useTheme();
  return (
    <Box textAlign={'center'} sx={{ ...styles }}>
      <SpotButtonStyled variant={variant} onClick={onClick}>
        {children}
      </SpotButtonStyled>
      {!!name ? (
        <Typography
          mt={theme.spacing(1)}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '75%',
            margin: '8px auto 0',
            userSelect: 'none',
          }}
          variant={'lifiBodySmall'}
        >
          {name}
        </Typography>
      ) : null}
    </Box>
  );
};
