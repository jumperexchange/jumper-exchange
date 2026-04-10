import { FormInput } from '@/components/Form/FormInput/FormInput';
import {
  ContentContainer,
  MenuItemWrapper,
} from '@/components/composite/JumperWidget/JumperWidget.style';
import { GoBackHeader } from '@/components/composite/JumperWidget/components/Headers';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import { debounce } from 'lodash';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SelectViewProps } from './types';

interface PortfolioSelectViewProps<T> extends SelectViewProps<T> {
  header: string;
  inputId: string;
  getItemKey: (item: T) => string;
  filterItem: (item: T, searchValue: string) => boolean;
  renderItem: (item: T) => ReactNode;
}

export function PortfolioSelectView<T>({
  onBack,
  onSelect,
  list,
  header,
  inputId,
  getItemKey,
  filterItem,
  renderItem,
}: PortfolioSelectViewProps<T>) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [searchValue, setSearchValue] = useState(value);
  const debouncedSetSearchValue = useMemo(
    () => debounce((v: string) => setSearchValue(v), 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearchValue.cancel();
    };
  }, [debouncedSetSearchValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: nextValue } = event.target;
    setValue(nextValue);
    debouncedSetSearchValue(nextValue);
  };

  const handleClear = () => {
    debouncedSetSearchValue.cancel();
    setSearchValue('');
    setValue('');
  };

  const filteredList = useMemo(() => {
    if (!list) {
      return [];
    }
    return list.filter((item) => filterItem(item, searchValue));
  }, [list, searchValue, filterItem]);

  return (
    <>
      <GoBackHeader header={header} onBack={onBack} />
      <ContentContainer>
        <FormControl sx={{ width: '100%' }}>
          <FormInput
            id={inputId}
            name={inputId}
            value={value}
            placeholder={t('search.placeholder')}
            startAdornment={<SearchIcon />}
            endAdornment={
              !!value && (
                <IconButton
                  size={Size.SM}
                  variant={Variant.Borderless}
                  onClick={handleClear}
                >
                  <ClearIcon />
                </IconButton>
              )
            }
            onChange={handleChange}
            sx={{
              '&.MuiInputBase-root': {
                background: (theme) =>
                  (theme.vars || theme).palette.surface1.main,
                borderRadius: (theme) => (theme.vars || theme).shape.radius12,
                border: 'none',
              },
            }}
          />
        </FormControl>
        {filteredList.map((item) => (
          <MenuItemWrapper
            key={getItemKey(item)}
            onClick={() => onSelect(item)}
          >
            {renderItem(item)}
          </MenuItemWrapper>
        ))}
      </ContentContainer>
    </>
  );
}
