import { styled } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ButtonPrimary } from '@/components/Button/Button.style';
import { Link } from '@/components/Link';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';

export const PortfolioAssetsListContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

export const PortfolioAssetContainer = styled(SectionCardContainer)(
  ({ theme }) => ({
    padding: theme.spacing(3),
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

export const PortfolioWelcomeScreenLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  padding: theme.spacing(1.75, 2.75),
}));

export const PortfolioEmptyContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

export const PortfolioEmptyContentContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(6.5),
  width: '100%',
  position: 'relative',
  zIndex: 1,
  '&:before': {
    content: '""',
    zIndex: -1,
    position: 'absolute',
    top: theme.spacing(-2),
    left: '50%',
    width: '90%',
    height: `calc(100% + ${theme.spacing(2)})`,
    transform: 'translateX(-50%)',
    backgroundColor: (theme.vars || theme).palette.surface2.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.surface1.main,
    }),
    filter: 'blur(32px)',
  },
}));

export const PortfolioEmptyContentDescriptionContainer = styled(Stack)(
  ({ theme }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  }),
);

export const PortfolioEmptyContentButton = styled(ButtonPrimary)(
  ({ theme }) => ({
    height: 'auto',
    padding: theme.spacing(1.75, 2.75),
    ...theme.typography.bodyMediumStrong,
  }),
);
