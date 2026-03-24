import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  BlogArticleContainer,
  BlogArticleContentContainer,
  BlogArticleContentSkeleton,
  BlogArticleHeaderMeta,
  BlogArticleHeaderMetaDate,
  BlogArticleHeaderTagSkeleton,
  BlogArticleImage,
  BlogArticleImageContainer,
  BlogArticleImageSkeleton,
  BlogArticleMetaSkeleton,
  BlogArticleSubtitle,
  BlogArticleSubtitleSkeleton,
  BlogArticleTitle,
  BlogArticleTitleSkeleton,
  BlogArticleTopHeader,
  BlogAuthorWrapper,
  BlogMetaContainer,
  Divider,
} from './BlogArticle.style';

import { Tag } from '@/components/Tag.style';
import type { BlogArticleData } from '@/types/strapi';
import { readingTime } from '@/utils/readingTime';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { ShareArticleIcons } from './ShareArticleIcons';
import { RichBlocks } from '@/components/RichBlocks/RichBlocks';
import { RichBlocksVariant } from '@/components/RichBlocks/types';
import { getTableOfContentsFromContent } from '@/utils/richBlocks/getTableOfContentsFromContent';
import { BlogArticleAuthor } from './BlogArticleAuthor';
import { BlogArticleTableOfContents } from './BlogArticleTableOfContents';
import { WithSkeleton } from './WithSkeleton';
import { AccordionFAQ } from '@/components/AccordionFAQ';
import { ScrollProgress } from './ScrollProgress';
import { useCallback } from 'react';
import { useBlogArticleStore } from '@/stores/learn/BlogArticleStore';
import dynamic from 'next/dynamic';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { buildArticleSchema } from '@/utils/articles/buildArticleSchema';
import Script from 'next/script';
import { useBlogArticleTracking } from '@/hooks/userTracking/useBlogArticleTracking';

const BlogArticleModal = dynamic(
  () => import('./BlogArticleModal').then((mod) => mod.BlogArticleModal),
  {
    ssr: false,
  },
);

interface BlogArticleProps {
  article: BlogArticleData;
  id?: number;
}

const IMAGE_HEIGHT = 640;
const SCROLL_PROGRESS_OPEN_POPUP = 0.3;

const tocStyles = {
  display: { xs: 'none', lg: 'block' },
  position: 'sticky',
  top: 16,
  alignSelf: 'flex-start',
  width: 240,
  flexShrink: 0,
} as const;

export const BlogArticle = ({ article }: BlogArticleProps) => {
  const theme = useTheme();
  const {
    id,
    documentId,
    Subtitle: subtitle,
    Title: title,
    Content: content,
    WordCount: wordCount,
    Slug: slug,
    author,
    publishedAt,
    createdAt,
    tags,
    Image: image,
    faq_items,
    popup,
  } = article;
  const baseUrl = getStrapiBaseUrl();
  const minRead = readingTime(wordCount);
  const { t } = useTranslation();
  const { trackBlogArticleOpenPopupEvent } = useBlogArticleTracking();

  const [isModalOpen, openModal] = useBlogArticleStore((s) => [
    s.isModalOpen,
    s.openModal,
  ]);

  const shouldOpenModal = useBlogArticleStore((s) =>
    s.shouldOpenModalForArticle(documentId),
  );

  const mainTag = tags?.[0];

  const handleScroll = useCallback(
    (scrollProgress: number) => {
      if (!popup) {
        return;
      }

      if (scrollProgress >= SCROLL_PROGRESS_OPEN_POPUP && !isModalOpen) {
        trackBlogArticleOpenPopupEvent(id, title, popup.Title);

        openModal(documentId, {
          title: popup.Title,
          description: popup.Message,
          ctaLink: popup.CTALink,
          cta: popup.CTA,
          isNewsletterSubscription: !!popup.IsNewsletterSubscription,
        });
      }
    },
    [
      documentId,
      popup,
      id,
      title,
      isModalOpen,
      openModal,
      trackBlogArticleOpenPopupEvent,
    ],
  );

  const blogArticleSchema = buildArticleSchema(article);

  const tableOfContents = getTableOfContentsFromContent(content);

  return (
    <>
      {isModalOpen && <BlogArticleModal articleId={id} articleTitle={title} />}
      <BlogArticleContainer>
        <BlogArticleContentContainer sx={{ marginTop: 0 }}>
          <BlogArticleTopHeader>
            <WithSkeleton
              show={!!mainTag?.Title}
              skeleton={<BlogArticleHeaderTagSkeleton variant="rectangular" />}
            >
              <Tag
                sx={
                  mainTag?.TextColor ? { color: mainTag.TextColor } : undefined
                }
                backgroundColor={mainTag?.BackgroundColor}
                component="span"
                variant="bodyMediumStrong"
                key={`blog-article-tag-${mainTag?.id}`}
              >
                {mainTag?.Title}
              </Tag>
            </WithSkeleton>

            <WithSkeleton
              show={!!createdAt}
              skeleton={<BlogArticleMetaSkeleton variant="text" />}
            >
              <BlogArticleHeaderMeta>
                <BlogArticleHeaderMetaDate variant="bodyXSmall" as="span">
                  {t('format.shortDate', {
                    value: new Date(publishedAt || createdAt!),
                  })}
                </BlogArticleHeaderMetaDate>
                <span>{t('blog.minRead', { minRead })}</span>
              </BlogArticleHeaderMeta>
            </WithSkeleton>
          </BlogArticleTopHeader>

          <WithSkeleton show={!!title} skeleton={<BlogArticleTitleSkeleton />}>
            <BlogArticleTitle variant="h1">{title}</BlogArticleTitle>
          </WithSkeleton>

          <WithSkeleton
            show={!!subtitle}
            skeleton={<BlogArticleSubtitleSkeleton variant="text" />}
          >
            <BlogArticleSubtitle variant="h2">{subtitle}</BlogArticleSubtitle>
          </WithSkeleton>

          <BlogMetaContainer>
            <Box
              sx={{
                [theme.breakpoints.down('sm')]: {
                  '.blog-author-socials': { display: 'none' },
                },
              }}
            >
              <BlogArticleAuthor
                author={author}
                articleId={id}
                source="blog-article-header"
              />
            </Box>
            <ShareArticleIcons title={title} slug={slug} />
          </BlogMetaContainer>
        </BlogArticleContentContainer>
      </BlogArticleContainer>

      <BlogArticleImageContainer>
        <WithSkeleton show={!!image} skeleton={<BlogArticleImageSkeleton />}>
          <BlogArticleImage
            src={`${baseUrl}${image!.url}`}
            alt={image?.alternativeText ?? title}
            priority
            width={1200}
            height={IMAGE_HEIGHT}
          />
        </WithSkeleton>
      </BlogArticleImageContainer>

      <BlogArticleContainer
        sx={(theme) => ({
          position: 'relative',
          display: 'flex',
          gap: 2,
          maxWidth:
            tableOfContents.length > 0
              ? `calc(${theme.breakpoints.values.md}px + 240px + ${theme.spacing(2)}) !important`
              : `${theme.breakpoints.values.md}px !important`,
        })}
      >
        {tableOfContents.length > 0 && (
          <BlogArticleTableOfContents items={tableOfContents} sx={tocStyles} />
        )}
        <BlogArticleContentContainer
          sx={{
            flex: 1,
            minWidth: 0,
            margin: '0 !important',
            maxWidth: '100% !important',
          }}
        >
          <ScrollProgress
            onScroll={shouldOpenModal ? handleScroll : undefined}
            topOffset={image ? `-${IMAGE_HEIGHT / 2}px` : 0}
          >
            <WithSkeleton
              show={!!content}
              skeleton={<BlogArticleContentSkeleton variant="text" />}
            >
              <RichBlocks
                content={content!}
                variant={RichBlocksVariant.BlogArticle}
                blockSx={{
                  paragraph: (theme) => ({
                    ...theme.typography.bodyLargeParagraph,
                    fontWeight: 400,
                  }),
                }}
                trackingKeys={{
                  cta: {
                    category: TrackingCategory.BlogArticle,
                    action: TrackingAction.ClickBlogCTA,
                    label: 'click-blog-cta',
                    data: {
                      [TrackingEventParameter.ArticleID]: String(id || ''),
                      [TrackingEventParameter.ArticleTitle]: title || '',
                    },
                  },
                }}
              />
            </WithSkeleton>
          </ScrollProgress>
        </BlogArticleContentContainer>
      </BlogArticleContainer>

      <BlogArticleContainer>
        <BlogArticleContentContainer>
          {faq_items?.length > 0 && (
            <AccordionFAQ
              accordionHeader={
                <BlogArticleSubtitle
                  variant="h2"
                  sx={{ marginTop: 0, marginBottom: 1 }}
                >
                  {t('blog.faq')}
                </BlogArticleSubtitle>
              }
              content={faq_items}
              questionTextTypography="bodyLargeStrong"
              itemSx={(theme) => ({
                background: (theme.vars || theme).palette.surface1.main,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  background: (theme.vars || theme).palette.surface1Hover,
                },
              })}
              sx={{ width: '100%', maxWidth: '100% !important' }}
            />
          )}
          <Divider />
          <BlogAuthorWrapper>
            <BlogArticleAuthor
              author={author}
              articleId={id}
              showRole
              source="blog-article-footer"
            />
          </BlogAuthorWrapper>
        </BlogArticleContentContainer>
      </BlogArticleContainer>

      {blogArticleSchema && (
        <Script type="application/ld+json" id="json-schema-article">
          {JSON.stringify(blogArticleSchema)}
        </Script>
      )}
    </>
  );
};
