import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import type { FC, PropsWithChildren } from 'react';

export type HeroHighlightType =
  | 'asset'
  | 'protocol'
  | 'apy'
  | 'token'
  | 'tag'
  | 'chain';

interface Props {
  type: HeroHighlightType;
  sx?: SxProps<Theme>;
}

const HighlightedSpan = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.accent1Alt.main,
  fontWeight: 'inherit',
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.accent1.main,
  }),
}));

export const HeroHighlight: FC<PropsWithChildren<Props>> = ({
  children,
  sx,
}) => {
  // TODO: LF-14990: Generate clickable links / filters events if possible.
  return <HighlightedSpan sx={sx}>{children}</HighlightedSpan>;
};
