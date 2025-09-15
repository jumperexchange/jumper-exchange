import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';

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

export const EntityChainInfoContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  overflow: 'hidden',
}));

export const EntityChainTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  ...getTextEllipsisStyles(1),
}));

export const EntityChainDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  ...getTextEllipsisStyles(1),
}));

export const EntityChainTypographySkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  transform: 'none',
  width: '100%',
  height: '100%',
  minWidth: 100,
  minHeight: 16,
  lineHeight: '100%',
}));
