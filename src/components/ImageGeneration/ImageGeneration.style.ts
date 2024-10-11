import { Box } from '@mui/material';

import type { CSSObject } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

export const widgetImageContainerStyles: CSSObject = {
  marginTop: '64px',
  position: 'absolute',
  top: 0,
  left: 0,
  height: '72px',
  width: '416px',
};

export const WidgetImageContainer = styled(Box)(() => ({
  ...widgetImageContainerStyles,
}));
