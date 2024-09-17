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
  textOverflow: 'ellipsis',
  fontWeight: '500',
  fontSize: '0.75rem',
  lineHeight: '16px',
  display: 'flex',
  alignItems: 'center',
}));

export const CustomAccordion = styled(Accordion)(({ theme }) => ({
  // background: 'transparent',
  border: 0,
  boxShadow: 'none',
  width: '100%',

  '& .MuiAccordionSummary-root': {
    padding: '16px',
    borderRadius: 12,

    '&:hover': {
      background: 'rgba(0, 0, 0, 0.04)',
    },
  },
}));

export const TypographyPrimary = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.125rem',
  fontWeight: 700,
  lineHeight: '1.5rem',
  alignSelf: 'stretch',
}));

export const TypographySecondary = styled(Typography)(({ theme }) => ({
  color: theme.palette.alphaDark700.main,
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

    '&:last-child': {
      marginLeft: '-6px',
    },
  },
}));
