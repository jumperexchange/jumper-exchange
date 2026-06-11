import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from '@/components/Button';
import { ButtonPrimary } from '@/components/Button/Button.style';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import { BaseIconButton } from '@/components/composite/WalletBalanceCard/WalletBalanceCard.styles';

export const PortfolioHeaderOverviewContainer = styled(SectionCardContainer)(
  ({ theme }) => ({
    minHeight: 312,
    height: '100%',
    padding: theme.spacing(3),
    backgroundColor: (theme.vars || theme).palette.surface1.main,
    border: getSurfaceBorder(theme, 'surface1'),
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
  '& .ticker-view > :not(.ticker-column-container)': {
    marginLeft: `${theme.spacing(-0.5)} !important`,
    marginRight: `${theme.spacing(-0.5)} !important`,
  },
}));

export const LightIconButton = styled(BaseIconButton)(({ theme }) => ({
  color: (theme.vars || theme).palette.buttonLightAction,
  backgroundColor: (theme.vars || theme).palette.buttonLightBg,
  height: 40,
  width: 40,
}));

export const PortfolioChartButtonsContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  [theme.breakpoints.up('sm')]: {
    marginLeft: 'auto',
  },
}));

interface PortfolioChartButtonProps extends Omit<ButtonProps, 'variant'> {
  isActive: boolean;
}

export const PortfolioChartButton = styled(ButtonPrimary, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<PortfolioChartButtonProps>(({ theme }) => ({
  ...theme.typography.bodyXXSmallStrong,
  lineHeight: '100%',
  padding: theme.spacing(0.5),
  height: 20,
  width: 'fit-content',
  minWidth: 28,
  variants: [
    {
      props: { isActive: false },
      style: {
        backgroundColor: (theme.vars || theme).palette.buttonLightBg,
        color: (theme.vars || theme).palette.buttonLightAction,
        '&:hover': {
          backgroundColor: (theme.vars || theme).palette.buttonPrimaryBg,
          color: (theme.vars || theme).palette.buttonPrimaryAction,
        },
      },
    },
    {
      props: { isActive: true },
      style: {
        cursor: 'default',
        pointerEvents: 'none',
      },
    },
  ],
}));

export const PortfolioChartContainer = styled(Box)(() => ({
  height: 120,
  width: '100%',
}));
