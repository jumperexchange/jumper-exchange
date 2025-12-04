import { styled } from '@mui/material/styles';

export const IllustrationWrapper = styled('div')(({ theme }) => {
  return {
    display: 'contents',
    '.background-color': {
      fill: (theme.vars || theme).palette.surface2.main,
      ...theme.applyStyles('light', {
        fill: (theme.vars || theme).palette.surface1.main,
      }),
    },
    '.primary-text-color': {
      fill: (theme.vars || theme).palette.text.primary,
    },
    '.stroke-color': {
      stroke: (theme.vars || theme).palette.surface2.main,
      ...theme.applyStyles('light', {
        stroke: (theme.vars || theme).palette.surface1.main,
      }),
    },
    '.deposit-action': {
      fill: (theme.vars || theme).palette.primary.main,
    },
    '.secondary-badge-bg': {
      fill: (theme.vars || theme).palette.badgeAccent1MutedBg,
    },
    '.secondary-badge-fg': {
      fill: (theme.vars || theme).palette.badgeAccent1MutedFg,
    },
  };
});
