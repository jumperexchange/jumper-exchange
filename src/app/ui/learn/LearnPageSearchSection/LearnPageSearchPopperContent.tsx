import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { Badge } from '@/components/Badge/Badge';
import { useFeaturedArticles } from '@/hooks/blog/useFeaturedArticles';
import { useSearchArticles } from '@/hooks/blog/useSearchArticles';
import { TAG_ALL } from '@/providers/LearnProvider/filtering/types';
import type { TagAttributes } from '@/types/strapi';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { sortBy, uniqBy } from 'lodash';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LearnPageSearchArticleList } from './LearnPageSearchArticleList';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { LearnPageSearchArticleListSkeleton } from './LearnPageSearchArticleListSkeleton';
import { useTranslation } from 'react-i18next';

type TagOption = Pick<TagAttributes, 'Title'> & { id: string | number };

const BADGE_SX = {
  '& .MuiChip-label': { textTransform: 'capitalize' },
} as const;

const fadeSlide = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.18, ease: 'easeOut' },
} as const;

interface LearnPageSearchPopperContentProps {
  searchValue: string;
}

export const LearnPageSearchPopperContent: FC<
  LearnPageSearchPopperContentProps
> = ({ searchValue }) => {
  const { t } = useTranslation();
  const [selectedTagId, setSelectedTagId] = useState<string | number>(TAG_ALL);

  const {
    data: articles,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useSearchArticles({
    searchText: searchValue,
  });

  const { data: featuredArticles } = useFeaturedArticles();

  useEffect(() => {
    setSelectedTagId(TAG_ALL);
  }, [searchValue]);

  const uniqueTags = useMemo<TagOption[]>(() => {
    const allTags = articles
      .flatMap((article) => article.tags ?? [])
      .filter((tag): tag is TagAttributes & { id: number } => tag?.id != null);
    return sortBy(uniqBy(allTags, 'id'), 'Title');
  }, [articles]);

  const tagOptions = useMemo<TagOption[]>(
    () => [{ id: TAG_ALL, Title: t('blog.tags.all') }, ...uniqueTags],
    [uniqueTags, t],
  );

  const filteredArticles =
    selectedTagId === TAG_ALL
      ? articles
      : articles.filter((article) =>
          article.tags?.some((t) => t.id === Number(selectedTagId)),
        );

  const hasResults = articles.length > 0;
  const isSearching = !!searchValue.trim();

  const contentKey = !isSearching
    ? 'popular'
    : isLoading || (isFetching && !hasResults)
      ? 'loading'
      : (isSuccess || isError) && !isFetching && !hasResults
        ? 'empty'
        : isSuccess || isFetching
          ? 'results'
          : 'idle';

  if (contentKey === 'idle') {
    return null;
  }

  const popularPostsSection = (
    <Stack
      sx={{
        gap: 1.5,
      }}
    >
      <Typography variant="bodyXSmallStrong" color="textHint" sx={{ my: 0.75 }}>
        {t('blog.popularPosts')}
      </Typography>
      <LearnPageSearchArticleList
        articles={featuredArticles?.slice(0, 6) ?? []}
      />
    </Stack>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={contentKey} {...fadeSlide}>
        {contentKey === 'popular' && popularPostsSection}

        {contentKey === 'loading' && (
          <Stack
            sx={{
              gap: 1.5,
            }}
          >
            <BaseSurfaceSkeleton
              variant="text"
              sx={{ height: 16, width: '30%', my: 0.75 }}
            />
            <LearnPageSearchArticleListSkeleton />
          </Stack>
        )}

        {contentKey === 'empty' && (
          <Stack
            sx={{
              gap: 2,
            }}
          >
            <Typography
              variant="bodyXSmallStrong"
              color="textHint"
              sx={{ my: 0.75 }}
            >
              {t('blog.noPostsFound')}
            </Typography>
            {popularPostsSection}
          </Stack>
        )}

        {contentKey === 'results' && (
          <Stack
            sx={{
              gap: 1.5,
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography variant="bodyXSmallStrong" color="textHint">
                {selectedTagId === TAG_ALL
                  ? t('search.result', {
                      count: articles.length,
                    })
                  : t('search.filteredResult', {
                      count: articles.length,
                      filterCount: `${filteredArticles.length}`,
                    })}
              </Typography>
              <Stack
                direction="row"
                sx={{
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}
              >
                {tagOptions.map((tag) => (
                  <Badge
                    key={tag.id}
                    label={tag.Title}
                    size={BadgeSize.MD}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      setSelectedTagId(tag.id);
                    }}
                    variant={
                      selectedTagId === tag.id
                        ? BadgeVariant.Primary
                        : BadgeVariant.Alpha
                    }
                    sx={BADGE_SX}
                  />
                ))}
              </Stack>
            </Stack>
            <LearnPageSearchArticleList
              articles={filteredArticles}
              highlight={searchValue.trim()}
            />
          </Stack>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
