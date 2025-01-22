import {
  type ButtonProps,
  Button,
  buttonClasses,
  darken,
  styled,
} from '@mui/material';

interface CustomLoadingButtonProps extends ButtonProps {
  overrideStyle: {
    mainColor?: string;
  };
}

export const CustomLoadingButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'overrideStyle',
})<CustomLoadingButtonProps>(({ theme, overrideStyle }) => ({
  [`&.${buttonClasses.loading}`]: {
    border: `1px solid ${overrideStyle?.mainColor ?? theme.palette.primary.main}`,
  },
  [`&.${buttonClasses.loadingIndicator}`]: {
    color: theme.palette.text.primary,
  },
  [`&.${buttonClasses.disabled}`]: {
    // TODO: Refactorize the button
    backgroundColor: darken(theme.palette.primary.main, 0.16),
  },
  ':hover': {
    backgroundColor: darken(theme.palette.primary.main, 0.16),
  },
}));
