import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Breakpoint } from '@mui/material';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IconButtonPrimary } from 'src/components';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { openInNewTab } from 'src/utils';
import { BlogCtaContainer, BlogCtaTitle } from '.';

interface BlogCTAProps {
  title?: string;
  url?: string;
  id?: number;
}

export const BlogCTA = ({ title, url, id }: BlogCTAProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const handleClick = () => {
    url ? openInNewTab(url) : navigate(url ?? '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
    trackEvent({
      category: TrackingCategory.BlogArticle,
      action: TrackingAction.ClickBlogCTA,
      label: 'click-blog-article-card',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
      data: {
        [TrackingEventParameter.ArticleTitle]: title,
        [TrackingEventParameter.ArticleID]: id,
      },
    });
  };
  return (
    <BlogCtaContainer onClick={handleClick}>
      <BlogCtaTitle>{title ?? t('blog.jumperCta')}</BlogCtaTitle>
      <IconButtonPrimary
        onClick={handleClick}
        sx={{
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            display: 'flex',
          },
        }}
      >
        <ArrowForwardIcon sx={{ width: '28px', height: '28px' }} />
      </IconButtonPrimary>
    </BlogCtaContainer>
  );
};
