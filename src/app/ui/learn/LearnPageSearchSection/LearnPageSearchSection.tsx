'use client';

import { FormInput } from '@/components/Form/FormInput/FormInput';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useEffect, useMemo, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size } from '@/components/core/buttons/types';
import { SectionCardContainer } from '@/components/Cards/SectionCard/SectionCard.style';
import { debounce } from 'lodash';
import { useQueryState } from 'nuqs';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { LearnPageSearchPopperContent } from './LearnPageSearchPopperContent';
import { useTranslation } from 'react-i18next';

const INPUT_ID = 'learn-search';

export const LearnPageSearchSection = () => {
  const { t } = useTranslation();
  const [value, setValue] = useQueryState('q', {
    defaultValue: '',
    shallow: true,
    scroll: false,
  });
  const [searchValue, setSearchValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const skipNextUrlSyncRef = useRef(false);

  const debouncedSetSearchValue = useMemo(
    () => debounce((v: string) => setSearchValue(v), 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearchValue.cancel();
    };
  }, [debouncedSetSearchValue]);

  useEffect(() => {
    if (skipNextUrlSyncRef.current) {
      return;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      setSearchValue('');
      setIsOpen(false);
      return;
    }
    setSearchValue(value);
    setIsOpen(true);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: nextValue } = event.target;
    skipNextUrlSyncRef.current = true;
    setValue(nextValue);
    debouncedSetSearchValue(nextValue);
    setIsOpen(true);
  };

  const handleClear = () => {
    debouncedSetSearchValue.cancel();
    skipNextUrlSyncRef.current = true;
    setValue('');
    setSearchValue('');
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box ref={anchorRef} sx={{ width: '100%' }}>
        <FormControl sx={{ width: '100%' }}>
          <FormInput
            id={INPUT_ID}
            name={INPUT_ID}
            value={value}
            placeholder={t('search.placeholder')}
            startAdornment={<SearchIcon />}
            endAdornment={
              !!value && (
                <IconButton size={Size.SM} onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              )
            }
            onChange={handleChange}
            onFocus={() => setIsOpen(true)}
            sx={{
              '&.MuiInputBase-root': {
                background: (theme) =>
                  (theme.vars || theme).palette.surface1.main,
              },
            }}
          />
        </FormControl>
        <Popper
          open={isOpen}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
          modifiers={[{ name: 'offset', options: { offset: [0, 2] } }]}
        >
          <SectionCardContainer
            sx={(theme) => ({
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 12rem)',
              ...theme.applyStyles('light', {
                background: (theme.vars || theme).palette.surface1.main,
              }),
            })}
          >
            <LearnPageSearchPopperContent searchValue={searchValue} />
          </SectionCardContainer>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
