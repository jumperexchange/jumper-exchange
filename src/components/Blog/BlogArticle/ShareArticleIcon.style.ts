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
  // height: '48px',
  // transition: 'background-color 0.3s',
  // color:
  //   theme.palette.mode === 'light'
  //     ? theme.palette.grey[800]
  //     : theme.palette.grey[300],
  // backgroundColor:
  //   theme.palette.mode === 'light'
  //     ? theme.palette.alphaDark100.main
  //     : theme.palette.alphaLight300.main,
  // '&:hover': {
  //   backgroundColor:
  //     theme.palette.mode === 'light'
  //       ? theme.palette.alphaDark300.main
  //       : theme.palette.alphaLight500.main,
  // },
}));
