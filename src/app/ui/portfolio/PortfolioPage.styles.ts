import { styled } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ButtonPrimary } from '@/components/Button/Button.style';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import Typography from '@mui/material/Typography';
import { BaseIconButton } from '@/components/composite/WalletBalanceCard/WalletBalanceCard.styles';

export const PortfolioAssetsListContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

export const PortfolioAssetContainer = styled(SectionCardContainer)(
  ({ theme }) => ({
    padding: theme.spacing(1.5),
    boxShadow: theme.shadows[2],
    backgroundColor: (theme.vars || theme).palette.surface2.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.surface1.main,
    }),
  }),
);

export interface PortfolioPageOverlayContentContainerProps extends BoxProps {
  portfolioWelcomeScreenClosed: boolean;
}
export const PortfolioPageOverlayContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'portfolioWelcomeScreenClosed',
})<PortfolioPageOverlayContentContainerProps>(({ theme }) => ({
  transition: 'margin-top 0.3s ease-in-out',
  willChange: 'margin-top',
  marginTop: 0,
  variants: [
    {
      props: ({ portfolioWelcomeScreenClosed }) =>
        !portfolioWelcomeScreenClosed,
      style: {
        marginTop: theme.spacing(8),
        [theme.breakpoints.up('sm')]: {
          marginTop: theme.spacing(10),
        },
        [theme.breakpoints.up('md')]: {
          marginTop: theme.spacing(19),
        },
      },
    },
  ],
}));

export const PortfolioWelcomeScreenButtonsContainer = styled(Stack)(
  ({ theme }) => ({
    margin: theme.spacing(4, 'auto', 0),
    width: 'fit-content',
    alignItems: 'center',
    gap: theme.spacing(2),
  }),
);

export const PortfolioWelcomeScreenButton = styled(ButtonPrimary)(
  ({ theme }) => ({
    width: 'fit-content',
    padding: theme.spacing(1.75, 2.75),
  }),
);

export const PortfolioHeaderOverviewContainer = styled(SectionCardContainer)(
  ({ theme }) => ({
    height: 312,
    padding: theme.spacing(3),
    boxShadow: theme.shadows[2],
    backgroundColor: (theme.vars || theme).palette.surface2.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.surface1.main,
    }),
  }),
);

export const PortfolioHeaderOverviewHeaderContainer = styled(Stack)(
  ({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
);

export const PortfolioHeaderOverviewContentContainer = styled(Stack)(
  ({ theme }) => ({
    flexDirection: 'column',
    alignItems: 'start',
  }),
);

export const PortfolioHeaderOverviewValue = styled(Typography)(({ theme }) => ({
  ...theme.typography.title2XLarge,
  textOverflow: 'ellipsis',
  userSelect: 'none',
}));

export const LightIconButton = styled(BaseIconButton)(({ theme }) => ({
  color: (theme.vars || theme).palette.buttonLightAction,
  backgroundColor: (theme.vars || theme).palette.buttonLightBg,
  height: 40,
  width: 40,
}));
