import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { ButtonProps } from 'src/components/Button';
import BoltIcon from 'src/components/illustrations/BoltIcon';

interface DepositIconProps {
  size: ButtonProps['size'];
}

export const DepositIcon = styled(BoltIcon, {
  shouldForwardProp: (prop) => prop !== 'size',
})<DepositIconProps>(() => ({
  variants: [
    {
      props: ({ size }) => size === 'small',
      style: {
        width: 17,
        height: 19,
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        width: 22,
        height: 24,
      },
    },
    {
      props: ({ size }) => size === 'large',
      style: {
        width: 24,
        height: 28,
      },
    },
  ],
}));

export const DepositButtonContentWrapper = styled(Box)(() => ({
  padding: 0.2,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
}));

export const DepositButtonLabelWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
}));
