import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { LogoLarge } from '../illustrations';
import { JumperBannerContainer } from './';

export const JumperBanner = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return (
    <JumperBannerContainer>
      <Box>
        <p>Ready to try yourself?</p>
        <LogoLarge />
      </Box>
      <Button variant="primary" onClick={handleClick}>
        Try Jumper now
      </Button>
    </JumperBannerContainer>
  );
};
