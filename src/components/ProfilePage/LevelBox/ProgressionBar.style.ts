import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/system';
import type { LevelData } from 'src/types/loyaltyPass';

export const LevelIndicatorWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '24px',
}));

interface ProgressionContainerProps extends BoxProps {
  hideLevelIndicator?: boolean;
}

export const ProgressionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hideLevelIndicator',
})<ProgressionContainerProps>(({ hideLevelIndicator }) => ({
  ...(!hideLevelIndicator
    ? {
        marginTop: 1.5,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
      }),
}));

export const ProgressionChart = styled(Box)(() => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  height: '16px',
  width: '100%',
  display: 'flex',
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
  height: '16px',
  borderRadius: '12px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark200.main
      : theme.palette.alphaLight200.main,
}));
