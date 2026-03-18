'use client';

import { BlogArticleCard } from '@/components/composite/cards/BlogArticleCard/BlogArticleCard';
import { FormInput } from '@/components/Form/FormInput/FormInput';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size } from '@/components/core/buttons/types';
import { SectionCardContainer } from '@/components/Cards/SectionCard/SectionCard.style';
import { useSearchArticles } from '@/hooks/useSearchArticles';
import { JUMPER_LEARN_PATH } from '@/const/urls';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import { debounce, sortBy, uniqBy } from 'lodash';
import { useQueryState } from 'nuqs';
import type { TagAttributes } from '@/types/strapi';
import { ClickAwayListener } from '@mui/material';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { TAG_ALL } from '@/providers/LearnProvider/filtering/types';

const SEARCH_PAGE_SIZE = 6;
const INPUT_ID = 'learn-search';
const TAG_FILTER_ALL = 'all';

const BADGE_SX = {
  '& .MuiChip-label': { textTransform: 'capitalize' },
} as const;

type TagOption = Pick<TagAttributes, 'Title'> & { id: string | number };

export const LearnPageSearchSection = () => {
  const [value, setValue] = useQueryState('q', {
    defaultValue: '',
    shallow: true,
    scroll: false,
  });
  const [searchValue, setSearchValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | number>(TAG_ALL);
  const anchorRef = useRef<HTMLDivElement>(null);

  const debouncedSetSearchValue = useMemo(
    () => debounce((v: string) => setSearchValue(v), 500),
    [],
  );

  const {
    data: articles,
    isLoading,
    isFetching,
    isSuccess,
  } = useSearchArticles({
    searchText: searchValue,
    pageSize: SEARCH_PAGE_SIZE,
  });

  useEffect(() => {
    setSelectedTagId(TAG_FILTER_ALL);
  }, [searchValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
    debouncedSetSearchValue(value);
    setIsOpen(true);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (!value) {
      return;
    }
    setIsOpen(true);
  };

  const handleClear = () => {
    setValue('');
    setSearchValue('');
  };

  const uniqueTags = useMemo<TagOption[]>(() => {
    const allTags = articles
      .flatMap((article) => article.tags ?? [])
      .filter((tag): tag is TagAttributes & { id: number } => tag?.id != null);
    return sortBy(uniqBy(allTags, 'id'), 'Title');
  }, [articles]);

  const tagOptions = useMemo<TagOption[]>(
    () => [{ id: TAG_ALL, Title: 'All' }, ...uniqueTags],
    [uniqueTags],
  );

  const filteredArticles =
    selectedTagId === TAG_FILTER_ALL
      ? articles
      : articles.filter((article) =>
          article.tags?.some((t) => t.id === Number(selectedTagId)),
        );

  const showPopper = isOpen;
  const showResults = showPopper && (isSuccess || isFetching);
  const hasResults = articles.length > 0;
  const showEmptyState = showPopper && isSuccess && !isFetching && !hasResults;
  const showPlaceholder = !isSuccess && articles.length === 0;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box ref={anchorRef} sx={{ width: '100%' }}>
        <FormControl sx={{ width: '100%' }}>
          <FormInput
            id={INPUT_ID}
            name={INPUT_ID}
            value={value}
            placeholder={'Search...'}
            startAdornment={<SearchIcon />}
            endAdornment={
              !!value && (
                <IconButton size={Size.SM} onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              )
            }
            onChange={handleChange}
            onFocus={handleFocus}
            sx={{
              '& input': {
                borderColor: (theme) => {
                  const hasValue = !!value?.trim();
                  return hasValue
                    ? 'transparent'
                    : (theme.vars || theme).palette.grey[100];
                },
              },
            }}
          />
        </FormControl>
        <Popper
          open={showPopper}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
          modifiers={[{ name: 'offset', options: { offset: [0, 2] } }]}
        >
          <SectionCardContainer
            sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 12rem)' }}
          >
            {showPlaceholder ? (
              'Popular articles'
            ) : isLoading || (isFetching && !hasResults) ? (
              <Stack alignItems="center" py={3}>
                <CircularProgress size={24} />
              </Stack>
            ) : showEmptyState ? (
              <Typography variant="bodySmallParagraph" color="textHint">
                No articles found.
              </Typography>
            ) : (
              showResults && (
                <Stack gap={1.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography variant="bodySmallParagraph" color="textHint">
                      {selectedTagId === TAG_FILTER_ALL
                        ? `${articles.length} ${articles.length === 1 ? 'result' : 'results'}`
                        : `${filteredArticles.length} of ${articles.length} ${articles.length === 1 ? 'result' : 'results'}`}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
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
                  <Stack
                    component="ul"
                    gap={1}
                    sx={{ listStyle: 'none', m: 0, p: 0 }}
                  >
                    {filteredArticles.map((article) => (
                      <Box component="li" key={article.id}>
                        <Link
                          href={
                            article.RedirectURL ??
                            `${JUMPER_LEARN_PATH}/${article.Slug}`
                          }
                          style={{ textDecoration: 'none' }}
                        >
                          <BlogArticleCard
                            variant="preview"
                            data={article}
                            highlight={value.trim()}
                          />
                        </Link>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              )
            )}
          </SectionCardContainer>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
