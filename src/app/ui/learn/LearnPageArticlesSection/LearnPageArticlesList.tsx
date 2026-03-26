import { BlogArticleCard } from '@/components/Blog/BlogArticleCard/BlogArticleCard';
import { BlogArticleCardSkeleton } from '@/components/Blog/BlogArticleCard/BlogArticleCardSkeleton';
import { GridContainer } from '@/components/Containers/GridContainer';
import { TrackingCategory } from '@/const/trackingKeys';
import type { BlogArticleData } from '@/types/strapi';
import { AnimatePresence, motion } from 'motion/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';

type LearnPageArticlesListNonLoadingProps = {
  loading?: false;
  items: BlogArticleData[];
  onClearFilters: () => void;
};

type LearnPageArticlesListLoadingProps = {
  loading: true;
  items?: never[];
  onClearFilters?: never;
};

type LearnPageArticlesListProps =
  | LearnPageArticlesListNonLoadingProps
  | LearnPageArticlesListLoadingProps;

const SKELETON_COUNT = 3;

const cardSx = {
  display: 'inline-block',
  '&.MuiCard-root': {
    width: '100%',
    minWidth: 'initial',
    maxWidth: 'initial',
  },
} as const;

const motionProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  exit: { opacity: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.3, ease: 'easeInOut' },
} as const;

export const LearnPageArticlesList: FC<LearnPageArticlesListProps> = ({
  items,
  loading,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const showPlaceholder = !!loading;
  const showEmptyState = !loading && !items?.length;

  if (showEmptyState) {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div {...motionProps}>
          <PortfolioEmptyList
            title={t('blog.emptyList.noResults.title')}
            description={t('blog.emptyList.noResults.description')}
            primaryButtonLabel={t('blog.emptyList.noResults.clearFilters')}
            onPrimaryButtonClick={onClearFilters}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <GridContainer
      gridTemplateColumns={'repeat(auto-fill, minmax(min(320px, 100%), 1fr))'}
      gap={3}
      justifyContent={'space-evenly'}
      dataTestId="blog-articles-cards-grid"
    >
      <AnimatePresence mode="popLayout">
        {showPlaceholder
          ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <motion.div
                {...motionProps}
                key={`blog-article-skeleton-${index}`}
              >
                <BlogArticleCardSkeleton sx={cardSx} />
              </motion.div>
            ))
          : items.map((item, index) => (
              <motion.div {...motionProps} key={`${item?.Slug}-${index}`}>
                <BlogArticleCard
                  sx={cardSx}
                  article={item}
                  trackingCategory={TrackingCategory.BlogArticlesCollection}
                />
              </motion.div>
            ))}
      </AnimatePresence>
    </GridContainer>
  );
};
