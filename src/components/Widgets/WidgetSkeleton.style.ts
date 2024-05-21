import { styled } from '@mui/material/styles';
import { WidgetContainer } from './Widgets.style';

export const WidgetSkeletonContainer = styled(WidgetContainer)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 416,
  maxHeight: 'unset',
  minHeight: 'unset',
  backgroundColor: theme.palette.surface1.main,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  borderRadius: theme.shape.borderRadius,

  '&:before': {
    display: 'none',
  },
  '& .widget-wrapper > div:before': {
    display: 'none',
  },
}));
