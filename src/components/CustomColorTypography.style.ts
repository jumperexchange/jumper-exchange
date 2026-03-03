import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const CustomColor = styled(Typography)(({ theme }) => ({
  backgroundImage: `linear-gradient(90deg, #FFF 25%, ${(theme.vars || theme).palette.accent1Alt.main} 50%, ${(theme.vars || theme).palette.violet[500]} 75%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  margin: 0,
  textFillColor: 'transparent',
  WebkitTextFillColor: 'transparent',
  userSelect: 'none',
  ...theme.applyStyles('light', {
    backgroundImage: `linear-gradient(90deg, ${(theme.vars || theme).palette.primary.main} 10%, ${(theme.vars || theme).palette.violet[500]} 100%)`,
  }),
}));
