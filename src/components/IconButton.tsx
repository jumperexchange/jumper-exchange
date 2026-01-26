import MuiIconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { alpha, styled } from '@mui/material/styles';

export const IconButton = styled(MuiIconButton)<IconButtonProps>(
  ({ theme }) => ({
    color: alpha(theme.palette.white.main, 0.84),
    transition: 'background 0.3s',
    width: '48px',
    height: '48px',
    backgroundColor: theme.palette.alphaLight300.main,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight200.main,

      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.alphaDark200.main,
      }),
    },
    ...theme.applyStyles('light', {
      backgroundColor: theme.palette.white.main,
      color: alpha(theme.palette.black.main, 0.84),
    }),
  }),
);

export const IconButtonPrimary = styled(IconButton)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor: theme.palette.primary.main,
  ':hover': {
    backgroundColor: `oklch(from ${(theme.vars || theme).palette.primary.main} calc(l - 0.1) c h)`,
    ...theme.applyStyles('light', {
      backgroundColor: `oklch(from ${(theme.vars || theme).palette.accent1.main} calc(l - 0.1) c h)`,
    }),
  },
  ...theme.applyStyles('light', {
    backgroundColor: theme.palette.accent1.main,
  }),
}));

export const IconButtonSecondary = styled(IconButton)(({ theme }) => ({
  // todo add color to theme
  color: theme.palette.white.main,
  backgroundColor: theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
    }),
  },
  ...theme.applyStyles('light', {
    color: '#240752',
    backgroundColor: theme.palette.white.main,
  }),
}));

export const IconButtonAlpha = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: theme.palette.alphaLight500.main,
    ...theme.applyStyles('light', {
      backgroundColor: theme.palette.alphaDark300.main,
    }),
  },
  ...theme.applyStyles('light', {
    backgroundColor: theme.palette.alphaDark100.main,
  }),
}));

export const IconButtonTransparent = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  ...theme.applyStyles('light', {
    backgroundColor: 'transparent',
  }),
}));

type IconButtonDynamicProps = IconButtonProps & {
  variant?: 'primary' | 'secondary' | 'alpha' | 'transparent';
};

export const IconButtonDynamic: React.FC<IconButtonDynamicProps> = ({
  variant,
  ...props
}) => {
  // TODO: this won't animate, replace with a proper component.
  switch (variant) {
    case 'primary':
      return <IconButtonPrimary {...props} />;
    case 'secondary':
      return <IconButtonSecondary {...props} />;
    case 'alpha':
      return <IconButtonAlpha {...props} />;
    case 'transparent':
      return <IconButtonTransparent {...props} />;
    case undefined:
      return <IconButton {...props} />;
  }
  // TODO: assert never type here
};
