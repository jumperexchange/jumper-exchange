import { styled, type BoxProps } from '@mui/material';

export interface ContainerProps extends Omit<BoxProps, 'variant'> {
  variant?: 'xs' | 'md' | 'lg';
  fixedPosition?: boolean;
}
//, {  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'cardsLayout',}
export const Container = styled('div')<ContainerProps>(
  ({ theme, fixedPosition }) => ({
    ...(!fixedPosition
      ? {
          position: 'static',
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: theme.spacing(3),
          marginBottom: theme.spacing(2.75),
        }
      : {
          position: 'fixed',
          display: 'block',
          bottom: theme.spacing(2.75),
          right: theme.spacing(3),
        }),
    zIndex: 1,

    '.link-lifi': {
      fontWeight: '700',
      color:
        theme.palette.mode === 'light'
          ? theme.palette.accent1.main
          : theme.palette.accent1Alt.main,
      textDecoration: 'none',
    },
  }),
);
