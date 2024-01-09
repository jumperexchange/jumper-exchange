import { Typography, useTheme } from '@mui/material';
import { useCountUpAnimation } from 'src/hooks';
import { ToolCardContainer } from './ToolCard.style';

interface ToolCardProps {
  number: string;
  title: string;
  handleClick: () => void;
}

export const ToolCard = ({ number, title, handleClick }: ToolCardProps) => {
  const theme = useTheme();
  const counter = useCountUpAnimation({ children: number, duration: 1000 });
  return (
    <ToolCardContainer
      className={'stats-card'}
      onClick={handleClick}
      sx={{ cursor: 'pointer' }}
    >
      <Typography
        variant={'lifiHeaderMedium'}
        sx={{
          fontSize: '24px',
          lineHeight: '32px',
          pointerEvents: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '80px',
          maxHeight: '32px',
          [theme.breakpoints.up('sm')]: {
            fontSize: '32px',
            maxHeight: '40px',
            lineHeight: '40px',
          },
        }}
      >
        {counter}
      </Typography>
      <Typography
        variant={'lifiBodySmall'}
        sx={{
          pointerEvents: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '80px',
          maxHeight: '20px',
          [theme.breakpoints.up('sm')]: {
            mt: theme.spacing(0.5),
            fontSize: '16px',
            maxWidth: '118px',
          },
        }}
      >
        {title}
      </Typography>
    </ToolCardContainer>
  );
};
