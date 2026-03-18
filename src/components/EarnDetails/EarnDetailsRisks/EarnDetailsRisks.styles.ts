import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import { ButtonTransparent, type ButtonProps } from '@/components/Button';

import { EarnDetailsSectionContainer } from '../EarnDetails.styles';
import { SectionCardContainer } from '@/components/Cards/SectionCard/SectionCard.style';

export const EarnDetailsRisksContainer = styled(EarnDetailsSectionContainer)(
  ({ theme }) => ({
    gap: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  }),
);

interface EarnDetailsRisksNavButtonProps extends ButtonProps {
  isActive: boolean;
}

export const EarnDetailsRisksNavButton = styled(ButtonTransparent, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<EarnDetailsRisksNavButtonProps>(({ theme }) => ({
  ...theme.applyStyles('light', {
    backgroundColor: 'transparent',
  }),
  ...theme.applyStyles('dark', {
    backgroundColor: 'transparent',
  }),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  height: theme.spacing(5),
  fontSize: theme.typography.body2.fontSize,
  '&:not(:first-of-type)': {
    marginLeft: theme.spacing(1),
  },
  variants: [
    {
      props: ({ isActive }) => isActive,
      style: {
        ...theme.applyStyles('light', {
          backgroundColor: theme.palette.alpha100.main,
        }),
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.alpha100.main,
        }),
      },
    },
  ],
}));

export const EarnRiskTagsContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
  padding: theme.spacing(3),
  borderRadius: theme.shape.cardBorderRadiusMedium,
  [theme.breakpoints.up('md')]: {
    flex: 1,
  },
}));

export const EarnRiskMissingWarning = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.statusError,
}));

export const EarnRiskSeeMoreButton = styled(Button)(({ theme }) => ({
  ...theme.typography.bodySmallParagraph,
  fontWeight: 700,
  color: (theme.vars || theme).palette.text.secondary,
  padding: 0,
  alignSelf: 'start',
}));

export const EarnRiskDescriptionModalContentContainer = styled(
  SectionCardContainer,
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: 488,
  maxWidth: 'calc(100vw - 32px)',
}));
