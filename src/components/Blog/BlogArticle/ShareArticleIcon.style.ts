import type { IconButtonProps } from '@mui/material';
import { styled } from '@mui/material';
import { IconButtonTertiary } from 'src/components/IconButton.style';

export interface ShareButtonProps extends Omit<IconButtonProps, 'component'> {
  expanded?: boolean;
}

export const ShareButton = styled(IconButtonTertiary, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<ShareButtonProps>(({ theme, expanded }) => ({
  marginLeft: theme.spacing(1.5),
  width: expanded ? 'auto' : '48px',
  ...(expanded && { borderRadius: '24px' }),
}));
