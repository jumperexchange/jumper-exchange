import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export enum MissionHeroStatsCardVariant {
  Default = 'default',
  Inverted = 'inverted',
}

interface MissionHeroStatsBoxProps {
  variant?: MissionHeroStatsCardVariant;
}

export const MissionHeroStatsBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<MissionHeroStatsBoxProps>(
  ({ theme, variant = MissionHeroStatsCardVariant.Default }) => ({
    position: 'relative',
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    border: `1px solid ${(theme.vars || theme).palette.alphaLight200.main}`,

    ...(variant === MissionHeroStatsCardVariant.Default && {
      color: (theme.vars || theme).palette.alphaLight900.main,
    }),

    ...(variant === MissionHeroStatsCardVariant.Inverted && {
      color: (theme.vars || theme).palette.alphaDark900.main,
    }),

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      zIndex: -1,
    },
  }),
);

export const MissionHeroStatsText = styled(Typography)(({ theme }) => ({}));
