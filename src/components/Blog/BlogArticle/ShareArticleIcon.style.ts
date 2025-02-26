import { IconButtonTertiary } from '@/components/IconButton.style';
import type { IconButtonProps } from '@mui/material';
import { styled } from '@mui/material';

export interface ShareButtonProps extends IconButtonProps {
  expanded?: boolean;
}

export const ShareButton = styled(IconButtonTertiary, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<ShareButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  width: '48px',
  variants: [
    {
      props: ({ expanded }) => expanded,
      style: {
        width: 'auto',
      },
    },
    {
      props: ({ expanded }) => expanded,
      style: { borderRadius: '24px' },
    },
  ],
}));
