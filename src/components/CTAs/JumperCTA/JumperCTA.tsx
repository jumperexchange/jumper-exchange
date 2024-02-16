import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { JumperBannerContainer } from '.';
import { LogoLarge } from '../../illustrations';

export const JumperCTA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return (
    <JumperBannerContainer>
      <Typography
        sx={{
          fontFamily: 'Urbanist, Inter',
          fontSize: '48px',
          lineHeight: '58px',
          fontWeight: 700,
        }}
      >
        {t('blog.jumperCta')} <LogoLarge />
      </Typography>
      <IconButton onClick={handleClick}>
        <ArrowForwardIcon />
      </IconButton>
    </JumperBannerContainer>
  );
};
