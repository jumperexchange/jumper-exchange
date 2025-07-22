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
    backgroundColor: (theme.vars || theme).palette.surface3.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.lavenderLight[0],
    }),
  }),
);

export const RewardsSectionContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
