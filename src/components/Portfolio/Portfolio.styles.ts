import {
  Accordion,
  AvatarGroup,
  Avatar,
  Typography,
  circularProgressClasses,
  CircularProgress as MuiCircularProgress,
  keyframes,
  darken,
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
            ? darken(theme.palette.surface2.main, 0.04)
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

const circleAnimation = keyframes`
  0% {
    stroke-dashoffset: 129;
    transform: rotate(0);
  }
  50% {
    stroke-dashoffset: 56;
    transform: rotate(45deg);
  };
  100% {
    stroke-dashoffset: 129;
    transform: rotate(360deg);
  }
`;

export const CircularProgressPending = styled(MuiCircularProgress)`
  color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.primary.light};
  animation-duration: 3s;
  position: absolute;
  .${circularProgressClasses.circle} {
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-name: ${circleAnimation};
    stroke-dasharray: 129;
    stroke-dashoffset: 129;
    stroke-linecap: round;
    transform-origin: 100% 100%;
  }
`;

export const Icon = styled(SvgIcon)``;
