import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from 'src/components/Button';
import { ButtonTransparent } from 'src/components/Button';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';

export const AssetOverviewCardContainer = styled(SectionCardContainer)(
  ({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
);

export const AssetOverviewNavigationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

interface AssetOverviewNavigationButtonProps extends Omit<
  ButtonProps,
  'variant'
> {
  isActive: boolean;
}

export const AssetOverviewNavigationButton = styled(ButtonTransparent, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<AssetOverviewNavigationButtonProps>(({ theme }) => ({
  '&.MuiButton-root.MuiButtonBase-root': {
    ...theme.typography.bodyXSmallStrong,
    borderRadius: theme.shape.buttonBorderRadius,
    padding: theme.spacing(1),
    height: 'auto',
    backgroundColor: 'transparent',
    color: (theme.vars || theme).palette.buttonAlphaDarkAction,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
      color: (theme.vars || theme).palette.buttonAlphaDarkAction,
    },
  },
  variants: [
    {
      props: ({ isActive }) => isActive,
      style: {
        '&.MuiButton-root.MuiButtonBase-root': {
          backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
          color: (theme.vars || theme).palette.buttonAlphaDarkAction,
        },
      },
    },
    {
      props: ({ disabled }) => !!disabled,
      style: {
        '&.MuiButton-root.MuiButtonBase-root': {
          backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
          color: (theme.vars || theme).palette.buttonDisabledAction,
        },
      },
    },
  ],
}));

export const AssetOverviewCardContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
}));

export const AssetOverviewCardOverviewContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export const AssetOverviewCardOverviewColumnContainer = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    flexBasis: '50%',
    '& .MuiStack-root + .MuiTypography-root': {
      ...theme.typography.bodySmallStrong,
    },
  }),
);

export const AssetOverviewCardAssetsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  gap: theme.spacing(1),
  overflow: 'hidden',
}));

export const AssetOverviewCardSharedContentContainer = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  }),
);

export const AssetOverviewCardSharedDescriptionContainer = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }),
);

export const AssetOverviewCardNoContentCtaContainer = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  }),
);
