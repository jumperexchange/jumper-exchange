import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IconButtonPrimary } from 'src/components';
import { openInNewTab } from 'src/utils';
import { BlogCtaContainer, BlogCtaTitle } from '.';

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
    <BlogCtaContainer onClick={handleClick}>
      <BlogCtaTitle>{title ?? t('blog.jumperCta')}</BlogCtaTitle>
      <IconButtonPrimary
        onClick={handleClick}
        sx={{ marginLeft: theme.spacing(4) }}
      >
        <ArrowForwardIcon sx={{ width: '28px', height: '28px' }} />
      </IconButtonPrimary>
    </BlogCtaContainer>
  );
};
