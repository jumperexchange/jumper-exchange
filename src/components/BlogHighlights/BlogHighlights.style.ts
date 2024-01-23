import { type CardProps } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface CircleProps extends Omit<CardProps, 'component'> {
  active: boolean;
  'data-index': number;
}
export const Circle = styled('span', {
  shouldForwardProp: (prop) => prop !== 'active',
})<CircleProps>(({ theme, active }) => ({
  display: 'block',
  width: 8,
  height: 8,
  borderRadius: 4,
  cursor: 'pointer',
  opacity: active ? 1 : 0.16,
  backgroundColor: theme.palette.alphaDark800.main,
  '&:not(:first-of-type)': {
    marginLeft: theme.spacing(0.5),
  },
  '&:not(:last-of-type)': {
    marginRight: theme.spacing(0.5),
  },
  ':hover': {
    backgroundColor: theme.palette.alphaDark600,
  },
}));

export const BlogHighlightsImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  borderRadius: '14px',
  userSelect: 'none',
  gridRow: '1 / span 2',
  gridColumn: '2',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  width: '100%',
  '&:hover': {
    cursor: 'pointer',
  },
}));
