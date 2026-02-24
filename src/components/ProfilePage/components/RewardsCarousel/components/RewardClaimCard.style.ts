import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { ButtonSecondary } from 'src/components/Button';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';

export const ClaimActionButton = styled(ButtonSecondary, {
  shouldForwardProp: (prop) => prop !== 'isDisabled',
})<{ isDisabled?: boolean }>(({ theme, isDisabled }) => ({
  height: theme.spacing(5),
  minWidth: 'fit-content',
  padding: theme.spacing(1.25, 2),
  color: (theme.vars || theme).palette.text.primary,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
  ...theme.typography.bodySmallStrong,
}));

export const RewardCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  borderRadius: theme.shape.cardBorderRadiusLarge,
  flexDirection: 'row',
  padding: theme.spacing(2),
  width: 'stretch',
  boxShadow: theme.shadows[2],

  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),

  [theme.breakpoints.up('sm')]: {
    width: theme.spacing(40),
    maxWidth: theme.spacing(40),
  },
}));

export const RewardCardActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  flexDirection: 'row',
  gap: theme.spacing(1),
}));

export const ExplorerLinkButton = styled(IconButton)<IconButtonProps>(
  ({ theme }) => ({
    color: (theme.vars || theme).palette.white.main,
    transition: 'background 0.3s',
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: (theme.vars || theme).palette.bgQuaternary.main,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.bgQuaternary.hover,
    },
  }),
);
