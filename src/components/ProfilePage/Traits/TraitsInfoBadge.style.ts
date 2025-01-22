import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import { Box, styled } from '@mui/material';

export const TraitsInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75),
  borderRadius: '16px',
  width: 'fit-content',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark100.main
      : theme.palette.alphaLight100.main,
}));

export const TraitsInfoStar = styled(StarIcon)(({ theme }) => ({
  width: '20px',
  height: '20px',
  color: theme.palette.white.main,
  padding: '5px',
  backgroundColor: '#31007A', // theme.palette.primary.main,
  borderRadius: '10px',
}));

export const TraitsInfoIcon = styled(InfoIcon)(({ theme }) => ({
  width: '20px',
  cursor: 'help',
  height: '20px',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark500.main
      : theme.palette.alphaLight500.main,
}));
