import { type BoxProps, darken, styled } from '@mui/material';
import LoadingButton, { type LoadingButtonProps } from '@mui/lab/LoadingButton';

interface CustomLoadingButtonProps extends LoadingButtonProps {
  overrideStyle: {
    mainColor?: string;
  };
}

export const CustomLoadingButton = styled(LoadingButton, {
  shouldForwardProp: (prop) => prop !== 'overrideStyle',
})<CustomLoadingButtonProps>(({ theme, overrideStyle }) => ({
  '&.MuiLoadingButton-loading': {
    border: `1px solid ${overrideStyle?.mainColor ?? theme.palette.primary.main}`,
  },
  '.MuiLoadingButton-loadingIndicator': {
    color: overrideStyle?.mainColor ?? theme.palette.primary.main,
  },
  '&.Mui-disabled': { // TODO: Refactorize the button
    backgroundColor: darken(theme.palette.primary.main, 0.16),
  },
  ':hover': {
    backgroundColor: darken(theme.palette.primary.main, 0.16),
  },
}));
