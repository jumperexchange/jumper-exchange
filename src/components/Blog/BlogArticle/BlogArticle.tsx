import Box from '@mui/material/Box';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTranslation } from 'react-i18next';

import { navbarHideOnScrollTriggerOptions } from '@/const/navbar';
import {
  BlogArticleContainer,
  BlogArticleContentContainer,
  BlogArticleContentSkeleton,
  BlogArticleImage,
  BlogArticleImageContainer,
  BlogArticleImageSkeleton,
  BlogArticleSubtitle,
  BlogArticleSubtitleSkeleton,
  BlogArticleTitle,
  BlogArticleTitleSkeleton,
  BlogArticleTopHeader,
  BlogAuthorWrapper,
  BlogMetaContainer,
  getContentContainerStylesForTOC,
  getTOCStyles,
} from './BlogArticle.style';

import type { BlogArticleData } from '@/types/strapi';
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
import { useCallback, useMemo, useRef } from 'react';
import { useBlogArticleStore } from '@/stores/learn/BlogArticleStore';
import dynamic from 'next/dynamic';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { buildArticleSchema } from '@/utils/articles/buildArticleSchema';
import Script from 'next/script';
import { BlogArticleMetadata } from '../BlogArticleMetadata/BlogArticleMetadata';
import { BadgeSize } from '@/components/Badge/Badge.styles';
import { BlogArticleMetadataSkeleton } from '../BlogArticleMetadata/BlogArticleMetadataSkeleton';
import useClient from '@/hooks/useClient';
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
const MAX_TOC_LEVELS = 2;

export const BlogArticle = ({ article }: BlogArticleProps) => {
  const { t } = useTranslation();

  const {
    id,
    documentId,
    Subtitle: subtitle,
    Title: title,
    Content: content,
    Slug: slug,
    author,
    Image: image,
    faq_items,
    popup,
  } = article;
  const baseUrl = getStrapiBaseUrl();
  const scrollHidesAppBar = useScrollTrigger(navbarHideOnScrollTriggerOptions);
  const { trackBlogArticleOpenPopupEvent } = useBlogArticleTracking();

  const [isModalOpen, openModal] = useBlogArticleStore((s) => [
    s.isModalOpen,
    s.openModal,
  ]);

  const shouldOpenModal = useBlogArticleStore((s) =>
    s.shouldOpenModalForArticle(documentId),
  );

  const isClient = useClient();
  const richBlocksRef = useRef<HTMLElement>(null);

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
  const displayTableOfContents = useMemo(
    () => tableOfContents.filter((item) => item.level <= MAX_TOC_LEVELS),
    [tableOfContents],
  );
  const hasToc = displayTableOfContents.length > 0;

  return (
    <>
      {isModalOpen && <BlogArticleModal articleId={id} articleTitle={title} />}
      <BlogArticleContainer>
        <BlogArticleContentContainer sx={{ marginTop: 0 }}>
          <BlogArticleTopHeader>
            <WithSkeleton
              show={isClient}
              skeleton={
                <BlogArticleMetadataSkeleton
                  tagSize={BadgeSize.XL}
                  metaVariant="bodyMedium"
                  sx={(theme) => ({
                    flexDirection: 'column',
                    gap: 3,
                    [theme.breakpoints.up('sm')]: {
                      flexDirection: 'row-reverse',
                      gap: 3,
                    },
                  })}
                />
              }
            >
              <BlogArticleMetadata
                article={article}
                tagSize={BadgeSize.XL}
                metaVariant="bodyMedium"
                sx={(theme) => ({
                  flexDirection: 'column',
                  gap: 3,
                  [theme.breakpoints.up('sm')]: {
                    flexDirection: 'row-reverse',
                    gap: 3,
                  },
                })}
              />
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
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  '.blog-author-socials': { display: 'none' },
                },
              })}
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

      <ScrollProgress
        onScroll={shouldOpenModal ? handleScroll : undefined}
        topOffset={image ? `-${IMAGE_HEIGHT / 2}px` : 0}
        progressRef={richBlocksRef}
        showProgress
      >
        <BlogArticleContainer
          sx={hasToc ? getContentContainerStylesForTOC : undefined}
        >
          {hasToc && (
            <BlogArticleTableOfContents
              items={displayTableOfContents}
              sx={(theme) => getTOCStyles(theme, { scrollHidesAppBar })}
            />
          )}
          <BlogArticleContentContainer>
            <Box ref={richBlocksRef}>
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
                      '& + &': {
                        marginTop:
                          theme.typography.bodyLargeParagraph.lineHeight,
                      },
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
            </Box>
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
                sx={{ width: '100%', maxWidth: '100% !important', paddingY: 2 }}
              />
            )}
          </BlogArticleContentContainer>
        </BlogArticleContainer>
      </ScrollProgress>

      <BlogArticleContainer>
        <BlogArticleContentContainer>
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
