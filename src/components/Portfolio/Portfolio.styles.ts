import { Accordion, AvatarGroup, darken, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { lighten } from '@mui/material/styles';

export const TotalValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  textOverflow: 'ellipsis',
  fontWeight: '700',
  // textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  fontSize: '3rem',
  lineHeight: '4rem',
}));

export const VariationValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textOverflow: 'ellipsis',
  fontWeight: '700',
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
}));

export const CustomAccordion = styled(Accordion)(({ theme }) => ({
  background: 'transparent',
  border: 0,
  boxShadow: 'none',

  '& .MuiAccordionSummary-root': {
    padding: 0,
    '&:hover': {
      background: lighten(theme.palette.secondary.main, 0.16),
    },
  },
}));

export const TypographyPrimary = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.125rem',
  fontWeight: 700,
  lineHeight: '1.5rem',
}));

export const TypographySecondary = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '1rem',
}));

export const CustomAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  justifyContent: 'flex-end',

  '& .MuiAvatar-colorDefault': {
    fontSize: '0.4rem',
  },

  '& .MuiAvatar-root': {
    width: 16,
    height: 16,
    border: '3px solid white',
    marginLeft: 0,
  },
}));
