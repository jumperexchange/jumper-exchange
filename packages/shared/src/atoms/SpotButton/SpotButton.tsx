import { Box, Typography, useTheme } from '@mui/material';
import { SpotButton as SpotButtonStyled } from './SpotButton.style';

interface SpotButtonProps {
  name?: string;
  variant?: string;
  onClick: any;
  children: any;
}

export const SpotButton = ({
  children,
  name,
  variant,
  onClick,
}: SpotButtonProps) => {
  const theme = useTheme();
  return (
    <Box textAlign={'center'} p={theme.spacing(3)}>
      <SpotButtonStyled variant={variant} onClick={onClick}>
        {children}
      </SpotButtonStyled>
      {!!name ? (
        <Typography
          mt={theme.spacing(2)}
          sx={{
            maxWidth: '64px',
            overflow: 'hidden',
            maxHeight: '32px',
            whiteSpace: 'normal',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            msTextOverflow: 'ellipsis',
          }}
          variant={'lifiBodyXSmallStrong'}
        >
          {name}
        </Typography>
      ) : null}
    </Box>
  );
};
