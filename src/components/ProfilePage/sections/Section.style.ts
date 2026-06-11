import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

// Keeps a section's tab pill group left-aligned and intrinsically sized (the
// shared HorizontalTabs container otherwise stretches to fill the row).
export const sectionTabsSx: SxProps<Theme> = (theme: Theme) => ({
  width: 'fit-content',
  flex: 'unset',
  '& button:not(.Mui-selected)': {
    color: `${(theme.vars || theme).palette.text.secondary} !important`,
  },
});

// The hero row: Jumper Pass card (grows) + RankCard (fixed width), matching the
// Figma. Stacks vertically below the lg breakpoint.
export const IntroHeroRow = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing(4),
  flexDirection: 'column',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },
}));
