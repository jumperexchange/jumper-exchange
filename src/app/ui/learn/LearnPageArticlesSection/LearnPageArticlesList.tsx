import { BlogArticleCard } from '@/components/Blog/BlogArticleCard/BlogArticleCard';
import { GridContainer } from '@/components/Containers/GridContainer';
import { TrackingCategory } from '@/const/trackingKeys';
import type { BlogArticleData } from '@/types/strapi';
import { AnimatePresence, motion } from 'motion/react';
import type { FC } from 'react';

interface LearnPageArticlesListProps {
  items: BlogArticleData[];
}

export const LearnPageArticlesList: FC<LearnPageArticlesListProps> = ({
  items,
}) => {
  return (
    <GridContainer
      gridTemplateColumns={'repeat(auto-fill, minmax(min(320px, 100%), 1fr))'}
      gap={3}
      justifyContent={'space-evenly'}
      dataTestId="blog-articles-cards-grid"
    >
      <AnimatePresence mode="popLayout">
        {items?.map((item, index) => (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            key={`${item?.Slug}-${index}`}
          >
            <BlogArticleCard
              sx={{
                display: 'inline-block',
                '&.MuiCard-root': {
                  width: '100%',
                  minWidth: 'initial',
                  maxWidth: 'initial',
                },
              }}
              article={item}
              key={`blog-articles-collection-${index}`}
              trackingCategory={TrackingCategory.BlogArticlesCollection}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </GridContainer>
  );
};
