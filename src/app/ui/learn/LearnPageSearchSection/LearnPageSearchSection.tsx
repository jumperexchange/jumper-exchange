'use client';

import { BlogArticleCard } from '@/components/composite/cards/BlogArticleCard/BlogArticleCard';
import { FormInput } from '@/components/Form/FormInput/FormInput';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useMemo, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size } from '@/components/core/buttons/types';
import { SectionCardContainer } from '@/components/Cards/SectionCard/SectionCard.style';
import { useSearchArticles } from '@/hooks/useSearchArticles';
import { JUMPER_LEARN_PATH } from '@/const/urls';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import { debounce } from 'lodash';

const SEARCH_PAGE_SIZE = 6;
const INPUT_ID = 'learn-search';

export const LearnPageSearchSection = () => {
  const [value, setValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
    debouncedSetSearchValue(value);
    setIsOpen(true);
  };

  const handleBlur = () => {
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

  const showPopper = isOpen && value.trim().length > 0;
  const showResults = showPopper && (isSuccess || isFetching);
  const hasResults = articles.length > 0;
  const showEmptyState = showPopper && isSuccess && !isFetching && !hasResults;

  return (
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
          onBlur={handleBlur}
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
        <SectionCardContainer>
          {isLoading || (isFetching && !hasResults) ? (
            <Stack alignItems="center" py={3}>
              <CircularProgress size={24} />
            </Stack>
          ) : showEmptyState ? (
            <Typography variant="bodySmallParagraph" color="textHint">
              No articles found.
            </Typography>
          ) : (
            showResults && (
              <Stack
                component="ul"
                gap={1}
                sx={{ listStyle: 'none', m: 0, p: 0 }}
              >
                {articles.map((article) => (
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
            )
          )}
        </SectionCardContainer>
      </Popper>
    </Box>
  );
};
