import { Link as UnstyledLink } from '@/components/Link';
import { styled } from '@mui/material/styles';

export const Link = styled(UnstyledLink)(({ theme }) => ({
  ...theme.typography.bodyMedium,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.white.main,
  textAlign: 'center',
  textDecoration: 'none',
  padding: theme.spacing(1.75, 2.5),
  transition: 'all 0.3s ease-in-out',
  borderRadius: '24px',
  height: 'auto',
  ...theme.applyStyles('light', {
    color: theme.palette.text.primary,
  }),
}));
