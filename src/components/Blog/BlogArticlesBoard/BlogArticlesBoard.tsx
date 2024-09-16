'use client';

import { type TabProps } from '@/components/Tabs';
import type { BlogArticleData } from '@/types/strapi';
import type { Theme } from '@mui/material';
import { Skeleton, useMediaQuery } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import {
  BlogArticlesBoardContainer,
  BlogArticlesBoardTitle,
} from './BlogArticlesBoard.style';
import { BlogArticlesBoardTab } from './BlogArticlesBoardTab';
import { BlogArticlesBoardTabs } from './BlogArticlesBoardTabs';

interface BlogArticlesBoardProps {
  data: BlogArticleData[];
  tags: GetTagsResponse;
}

const ariaLabel = 'blog-articles-board-tab-handler';
const pageSize = 6;
export const BlogArticlesBoard = ({ data, tags }: BlogArticlesBoardProps) => {
  const { t } = useTranslation();
  const [tabId, setTabId] = useState<number | undefined>(0);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const handleTagsClick = useCallback(
    (id: number, label?: string) => () => {
      if (!isDesktop && !openDropdown) {
        setOpenDropdown(true);
      } else {
        setOpenDropdown(false);
      }
      setTabId(id);
    },
    [isDesktop, openDropdown],
  );

  const filteredTags = useMemo<TabProps[]>(() => {
    // default "All" Category
    // const defaultFilter = {
    //   id: 0,
    //   label:
    //     !isDesktop && tabId !== 0 ? catLabel || '' : t('blog.allCategories'),
    //   icon: !isDesktop && (
    //     <ArrowDropDownIcon
    //       sx={{
    //         position: 'absolute',
    //         right: theme.spacing(1),
    //         marginBottom: 0,
    //       }}
    //     />
    //   ),
    //   attributes: [],
    //   value: 0,
    //   onClick: handleTagsClick(0, t('blog.allCategories')),
    //   disabled: false,
    // };
    // tags
    const output = tags?.data.map((el, index: number) => {
      return {
        label: el.attributes.Title || '',
        value: el.id,
        onClick: handleTagsClick(index, el.attributes.Title),
        // disabled: false,
      };
    });
    // merge default + tags
    // output?.unshift(defaultFilter);
    return output;
  }, [handleTagsClick, tags?.data]);

  const handleClick = (event: { target: HTMLElement }) => {
    // Avoid checking classList, use state and props to manage the dropdown logic
    const isClickInsideDropdown =
      event.target.getAttribute('aria-label') === ariaLabel;

    if (openDropdown && !isClickInsideDropdown) {
      setOpenDropdown(false);
    }
  };

  return (
    <BlogArticlesBoardContainer
      id="see-all"
      onClick={(event: React.MouseEvent<HTMLDivElement>) =>
        handleClick({ target: event.target as HTMLElement })
      }
    >
      <BlogArticlesBoardTitle variant="headerMedium">
        {t('blog.categories')}
      </BlogArticlesBoardTitle>
      {filteredTags ? (
        <BlogArticlesBoardTabs
          ariaLabel={ariaLabel}
          openDropdown={openDropdown}
          filteredTags={filteredTags}
          tabId={tabId}
        />
      ) : (
        <Skeleton sx={{ width: '100%', height: 68 }} />
      )}
      {/* <Fade in={!!data} timeout={600}> */}
      {!data ? (
        Array.from({ length: tags.meta.pagination.pageSize }).map(
          (_, index) => (
            <BlogArticleCardSkeleton
              key={`blog-article-card-skeleton-${tabId}-${index}`}
            />
          ),
          2,
        )
      ) : tags.data?.length > 0 ? (
        tags.data?.map((tag, tagIndex: number) => {
          const pagination = {
            page: 0,
            pageSize: pageSize,
            pageCount: Math.ceil(
              tag.attributes.blog_articles.data.length / pageSize,
            ),
            total: tag.attributes.blog_articles.data.length,
          };
          return (
            <BlogArticlesBoardTab
              value={tabId || 0}
              index={tagIndex}
              key={`bloag-articles-tab-${tagIndex}`}
              tags={tags}
              pagination={pagination}
              ariaLabel={ariaLabel}
              data={tag.attributes.blog_articles.data}
            />
          );
        })
      ) : (
        <p>No Content</p> //todo: find better option
      )}
      {/* </Fade> */}
    </BlogArticlesBoardContainer>
  );
};
