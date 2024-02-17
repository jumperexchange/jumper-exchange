import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Breakpoint } from '@mui/material';
import {
  IconButton,
  Typography,
  darken,
  lighten,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { openInNewTab } from 'src/utils';
import { JumperBannerContainer } from '.';

interface BlogCTAProps {
  title?: string;
  url?: string;
}

export const BlogCTA = ({ title, url }: BlogCTAProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const handleClick = () => {
    url ? openInNewTab(url) : navigate(url ?? '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return (
    <JumperBannerContainer>
      <Typography
        sx={{
          fontFamily: 'Urbanist, Inter',
          fontWeight: 700,
          fontSize: '32px',
          lineHeight: '38px',

          [theme.breakpoints.up('sm' as Breakpoint)]: {
            fontSize: '48px',
            lineHeight: '58px',
          },
        }}
      >
        {title ?? t('blog.jumperCta')}
      </Typography>
      <IconButton
        onClick={handleClick}
        sx={{
          display: 'none',
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            backgroundColor: '#E7D6FF', //todo: add to theme
            display: 'flex',
            width: '48px',
            height: '48px',
            transition: 'background 0.3s',
          },
          '&:hover': {
            background:
              theme.palette.mode === 'light'
                ? darken('#E7D6FF', 0.04)
                : lighten('#E7D6FF', 0.4),
          },
        }}
      >
        <ArrowForwardIcon
          sx={{
            color: '#240752', //todo: add to theme
          }}
        />
      </IconButton>
    </JumperBannerContainer>
  );
};
