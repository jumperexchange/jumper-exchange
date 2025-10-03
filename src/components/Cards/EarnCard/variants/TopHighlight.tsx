import { styled } from '@mui/material/styles';
import { FC, PropsWithChildren } from 'react';

interface Props {
  type: 'asset' | 'protocol' | 'apy' | 'token' | 'tag' | 'chain';
}

const HighlightedSpan = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.accent1Alt.main,
  fontWeight: 'inherit',
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.accent1.main,
  }),
}));

export const TopHighlight: FC<PropsWithChildren<Props>> = ({ children }) => {
  // TODO: LF-14990: Generate clickable links / filters events if possible.
  return <HighlightedSpan>{children}</HighlightedSpan>;
};
