import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export enum ChainAvatarSize {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export const ChainAvatarStack = styled(Stack)(({ theme }) => ({}));

// @Note extract this in a separate component
const BaseAvatar = styled(Avatar)(({ theme }) => ({
  boxSizing: 'content-box',
  border: 2,
  borderStyle: 'solid',
  borderColor: (theme.vars || theme).palette.background.default,
  ...theme.applyStyles('light', {
    borderColor: (theme.vars || theme).palette.white.main,
  }),
}));

interface ChainAvatarProps {
  size?: ChainAvatarSize;
}

export const ChainAvatar = styled(BaseAvatar, {
  shouldForwardProp: (prop) => prop !== 'size',
})<ChainAvatarProps>(({ size = ChainAvatarSize.MD }) => ({
  ...(size === ChainAvatarSize.XS && {
    width: 16,
    height: 16,
  }),
  ...(size === ChainAvatarSize.SM && {
    // @Note this might need to be updated
    width: 20,
    height: 20,
  }),
  ...(size === ChainAvatarSize.MD && {
    height: 24,
    width: 24,
  }),
  ...(size === ChainAvatarSize.LG && {
    height: 32,
    width: 32,
  }),
}));
