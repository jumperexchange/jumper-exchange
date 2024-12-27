import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/system';
import type { LevelData } from 'src/types/loyaltyPass';

export const LevelIndicatorWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),
}));

interface ProgressionContainerProps extends BoxProps {
  hideLevelIndicator?: boolean;
}

export const ProgressionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hideLevelIndicator',
})<ProgressionContainerProps>(({ hideLevelIndicator }) => ({
  position: 'relative',
  ...(!hideLevelIndicator
    ? {
        marginTop: 8,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
      }),
}));

interface ProgressionChartProps extends BoxProps {
  hideLevelIndicator?: boolean;
  label?: string;
}

export const ProgressionChart = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'label',
})<ProgressionChartProps>(({ theme, label }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  height: '16px',
  width: '100%',
  display: 'flex',
  ...(!!label && {
    height: 24,
    ':before': {
      content: `"${label}"`,
      position: 'absolute',
      width: '100%',
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: '24px',
      color:
        theme.palette.mode === 'light'
          ? theme.palette.primary.main
          : theme.palette.white.main,
    },
  }),
}));

export interface ProgressionChartScoreProps
  extends Omit<BoxProps, 'component'> {
  ongoingValue?: number;
  levelData?: LevelData;
  calcWidth?: number;
}

export const ProgressionChartScore = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'ongoingValue' && prop !== 'levelData' && prop !== 'calcWidth',
})<ProgressionChartScoreProps>(
  ({ theme, ongoingValue, levelData, calcWidth }) => ({
    height: '100%',
    width:
      ongoingValue && levelData && ongoingValue > levelData?.minPoints
        ? `${calcWidth}%`
        : '0%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.accent1.main
        : theme.palette.accent1Alt.main,
    ...(ongoingValue &&
      levelData &&
      ongoingValue === levelData.maxPoints && { borderRadius: '12px' }),
  }),
);

export const ProgressionChartBg = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark200.main
      : theme.palette.alphaLight200.main,
}));
