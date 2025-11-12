import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface EntityChainContainerProps {
  isContentVisible?: boolean;
}

export const EntityChainContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isContentVisible',
})<EntityChainContainerProps>(({ theme, isContentVisible }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  ...(isContentVisible && {
    minWidth: 0,
    overflow: 'hidden',
  }),
}));

export const EntityChainStackWrapper = styled(Box)(({}) => ({
  position: 'relative',
  width: 'fit-content',
}));

export const ChainStackWrapper = styled(Box)(({}) => ({
  position: 'absolute',
  bottom: -2,
  right: -7,
}));
