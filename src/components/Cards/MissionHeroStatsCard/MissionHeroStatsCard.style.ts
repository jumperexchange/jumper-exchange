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
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    borderRadius: 16,
    overflow: 'hidden',

    ...(variant === MissionHeroStatsCardVariant.Default && {
      color: (theme.vars || theme).palette.alphaLight900.main,
      backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
      border: `1px solid ${(theme.vars || theme).palette.alphaLight200.main}`,

      '& .MuiAvatar-root': {
        borderColor: (theme.vars || theme).palette.lavenderLight[0],
      },
    }),

    ...(variant === MissionHeroStatsCardVariant.Inverted && {
      color: (theme.vars || theme).palette.alphaDark900.main,
      backgroundColor: (theme.vars || theme).palette.alphaDark300.main,
      border: `1px solid ${(theme.vars || theme).palette.alphaDark200.main}`,

      '& .MuiAvatar-root': {
        borderColor: (theme.vars || theme).palette.alphaDark900.main,
      },
    }),

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      zIndex: -1,
    },
  }),
);

export const MissionHeroStatsText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: 120,
}));
