import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/system';
import type { LevelData } from 'src/types/loyaltyPass';

export const ProgressionChart = styled(Box)(() => ({
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
  borderTopLeftRadius: '12px',
  borderBottomLeftRadius: '12px',
  width:
    points && levelData && points > levelData?.minPoints
      ? `${calcWidth}%`
      : '0%',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.pink.light
      : theme.palette.accent1Alt.main,
  ...(points &&
    levelData &&
    points === levelData.maxPoints && { borderRadius: '12px' }),
}));

export const ProgressionChartBg = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'points' && prop !== 'levelData' && prop !== 'calcWidth',
})<ProgressionChartScoreProps>(({ theme, points, levelData, calcWidth }) => ({
  height: '100%',
  borderTopRightRadius: '12px',
  borderBottomRightRadius: '12px',
  width:
    points && levelData && calcWidth && points > levelData.minPoints
      ? `${100 - calcWidth}%`
      : '100%',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark200.main
      : theme.palette.alphaLight200.main,
  ...(points && { borderRadius: '12px' }),
}));
