import {
  Accordion,
  AvatarGroup,
  Avatar,
  Typography,
  circularProgressClasses,
  CircularProgress as MuiCircularProgress,
  keyframes,
  darken,
  Divider,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';
import { lighten } from '@mui/material/styles';
import { AccordionProps } from '@mui/material/Accordion';
import SvgIcon from '@mui/material/SvgIcon/SvgIcon'; // Import AccordionProps

export const TotalValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  textOverflow: 'ellipsis',
  fontWeight: '700',
  fontSize: '48px',
  lineHeight: '64px',
  fontFamily: 'var(--font-inter)',
  userSelect: 'none',
}));

export const VariationValue = styled(Typography)(({ theme }) => ({
  textOverflow: 'ellipsis',
  fontWeight: '500',
  fontSize: '0.75rem',
  lineHeight: '16px',
  display: 'flex',
  alignItems: 'center',
}));

export const CustomAccordion = styled(Accordion)<{ isExpanded?: boolean }>(
  ({ theme, isExpanded }) => ({
    background: 'transparent',
    border: 0,
    boxShadow: 'none',
    width: '100%',

    '& .MuiAccordionSummary-root': {
      padding: '16px',
      borderRadius: 12,
      '&:hover': {
        backgroundColor:
          theme.palette.mode === 'dark'
            ? lighten(theme.palette.surface2.main, 0.04)
            : darken(theme.palette.surface2.main, 0.04),
        borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
      },
    },
  }),
);

export const TypographyPrimary = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.125rem',
  fontWeight: 700,
  lineHeight: '1.5rem',
  alignSelf: 'stretch',
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
    border: `2px solid ${theme.palette.surface2.main}`,

    '&:last-child': {
      marginLeft: '-6px',
    },
  },
}));

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 16,
  height: 16,
  border: `2px solid ${theme.palette.surface2.main}`,
}));

export const Icon = styled(SvgIcon)``;

export const CustomDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.surface2.main,
  opacity: 0.3,
}));

export const PortfolioBox = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  justifyContent: 'center',
  padding: '16px',
  paddingTop: '0px',
  paddingBottom: '0px',
}));

export const NoTokenImageBox = styled(Box)(() => ({
  backgroundColor: 'grey',
  borderRadisu: '50%',
  height: 40,
  width: 40,
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
}));

export const PortfolioSkeletonBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignContent: 'center',
  alignItems: 'center',
}));
