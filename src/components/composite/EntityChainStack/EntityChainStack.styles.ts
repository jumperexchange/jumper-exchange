import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const EntityChainContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
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
