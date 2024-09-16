import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/system';
import type { LevelData } from 'src/types/loyaltyPass';

export const ProgressionChart = styled(Box)(() => ({
  position: 'relative',
  height: '16px',
  width: '100%',
  display: 'flex',
  marginTop: '12px',
  marginBottom: '12px',
}));

export interface ProgressionChartScoreProps
  extends Omit<BoxProps, 'component'> {
  points?: number;
  levelData?: LevelData;
  calcWidth?: number;
}

export const ProgressionChartScore = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'points' && prop !== 'levelData' && prop !== 'calcWidth',
})<ProgressionChartScoreProps>(({ theme, points, levelData, calcWidth }) => ({
  height: '100%',
  borderRadius: '12px',
  width:
    points && levelData && points > levelData?.minPoints
      ? `${calcWidth}%`
      : '0%',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.accent1.main
      : theme.palette.accent1Alt.main,
  ...(points &&
    levelData &&
    points === levelData.maxPoints && { borderRadius: '12px' }),
}));

export const ProgressionChartBg = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'points' && prop !== 'levelData' && prop !== 'calcWidth',
})<ProgressionChartScoreProps>(({ theme, points }) => ({
  position: 'absolute',
  width: '100%',
  height: '16px',
  borderRadius: '12px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark200.main
      : theme.palette.alphaLight200.main,
  ...(points && { borderRadius: '12px' }),
}));
