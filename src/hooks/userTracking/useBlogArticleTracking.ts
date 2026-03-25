import { useCallback } from 'react';
import { useUserTracking } from './useUserTracking';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';

export const useBlogArticleTracking = () => {
  const { trackEvent } = useUserTracking();

  const trackBlogArticleOpenPopupEvent = useCallback(
    (articleId: number, articleTitle: string, popupTitle?: string) => {
      trackEvent({
        category: TrackingCategory.BlogArticle,
        action: TrackingAction.OpenArticlePopup,
        label: `blog-article-popup`,
        data: {
          [TrackingEventParameter.ArticleID]: articleId.toString(),
          [TrackingEventParameter.ArticleTitle]: articleTitle,
          [TrackingEventParameter.ArticlePopupTitle]: popupTitle || '',
        },
      });
    },
    [trackEvent],
  );

  const trackBlogArticleClosePopupEvent = useCallback(
    (articleId: number, articleTitle: string, popupTitle?: string) => {
      trackEvent({
        category: TrackingCategory.BlogArticle,
        action: TrackingAction.CloseArticlePopup,
        label: `blog-article-popup`,
        data: {
          [TrackingEventParameter.ArticleID]: articleId.toString(),
          [TrackingEventParameter.ArticleTitle]: articleTitle,
          [TrackingEventParameter.ArticlePopupTitle]: popupTitle || '',
        },
      });
    },
    [trackEvent],
  );

  return {
    trackBlogArticleOpenPopupEvent,
    trackBlogArticleClosePopupEvent,
  };
};
