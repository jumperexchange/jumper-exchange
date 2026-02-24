import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';

export const IntroSectionContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing(4),
  flexDirection: 'column',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },
}));

export const RewardsSectionContainer = styled(SectionCardContainer)(
  ({ theme }) => ({
    overflowX: 'hidden',
    backgroundColor: (theme.vars || theme).palette.surface2.main,
    border: getSurfaceBorder(theme, 'surface2'),
  }),
);

export const RewardsSectionContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

export const RewardsSectionHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));
