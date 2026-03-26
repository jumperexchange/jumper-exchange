import type { SxProps, Theme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { useMemo, type FC } from 'react';
import type { TableOfContentsItem } from '@/utils/richBlocks/getTableOfContentsFromContent';
import { Link } from '@/components/Link/Link';
import { useActiveTocSectionId } from '@/hooks/useActiveTocSectionId';
import { useTranslation } from 'react-i18next';

interface BlogArticleTableOfContentsProps {
  items: TableOfContentsItem[];
  activeSectionScrollOffsetPx?: number;
  sx?: SxProps<Theme>;
}

export const BlogArticleTableOfContents: FC<
  BlogArticleTableOfContentsProps
> = ({ items, sx, activeSectionScrollOffsetPx }) => {
  const { t } = useTranslation();

  const minLevel = useMemo(
    () => items.reduce((min, item) => Math.min(min, item.level), 6),
    [items],
  );

  const sectionIds = useMemo(() => items.map((item) => item.id), [items]);

  const activeId = useActiveTocSectionId(
    sectionIds,
    activeSectionScrollOffsetPx,
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <Box component="nav" aria-label="Table of contents" sx={sx}>
      <Typography variant="title2XSmall" component="h5">
        {t('blog.tableOfContents.title')}
      </Typography>
      <Box component="ul" sx={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item) => (
          <TocItem
            key={item.id}
            item={item}
            indentDepth={item.level - minLevel}
            isActive={item.id === activeId}
          />
        ))}
      </Box>
    </Box>
  );
};

interface TocItemProps {
  item: TableOfContentsItem;
  indentDepth: number;
  isActive: boolean;
}

const TocItem: FC<TocItemProps> = ({ item, indentDepth, isActive }) => (
  <Box
    component="li"
    sx={(theme) => ({
      lineHeight: '0 !important',
      marginY: `${theme.spacing(1)} !important`,
      paddingLeft: theme.spacing(indentDepth * 2),
    })}
  >
    <Link
      href={`#${item.id}`}
      underline="hover"
      aria-current={isActive ? 'location' : undefined}
      sx={(theme) => {
        const palette = (theme.vars || theme).palette;
        return {
          ...theme.typography.bodyXSmall,
          fontWeight: isActive ? 600 : 400,
          color: `${isActive ? palette.textPrimaryEmphasized : palette.textHint} !important`,
          '&:hover': {
            color: `${palette.textPrimaryEmphasized} !important`,
          },
        };
      }}
    >
      {item.text}
    </Link>
  </Box>
);
