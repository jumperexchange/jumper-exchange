import { PropsWithChildren, useState } from 'react';
import {
  FilterCategoryConfig,
  GenericFilterDrawerProps,
} from './GenericFilterDrawer.types';
import { useFullScreenDrawer } from 'src/components/core/FullScreenDrawer/hooks';
import {
  SelectDisplayMode,
  SelectOption,
  SelectProps,
  SelectVariant,
  TData,
} from 'src/components/core/form/Select/Select.types';
import { Select } from 'src/components/core/form/Select/Select';
import { FullScreenDrawer } from 'src/components/core/FullScreenDrawer/FullScreenDrawer';
import Stack from '@mui/material/Stack';
import { getDefaultBadgeLabel } from './utils';
import { FilterCategoryItem } from './FilterCategoryItem';
import {
  GenericFilterDrawerAlphaButton,
  GenericFilterDrawerDivider,
  GenericFilterDrawerIconButton,
  GenericFilterDrawerPrimaryButton,
} from './GenericFilterDrawer.styles';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { SelectBadge } from 'src/components/core/form/Select/components/SelectBadge';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export const GenericFilterDrawer = <TFilterKey extends string = string>({
  categories,
  filterValues,
  filterOptions,
  onFilterChange,
  onClearAll,
  sliderRanges,
  hasFilterApplied,
  filtersCount,
  drawerTitle = 'Filter and sort',
  applyButtonLabel = 'Filter and sort',
  clearButtonLabel = 'Clear all',
  children,
}: PropsWithChildren<GenericFilterDrawerProps<TFilterKey>>) => {
  const { isOpen, open, close } = useFullScreenDrawer();
  const [currentLayer, setCurrentLayer] = useState<'main' | TFilterKey>('main');

  const handleNavigateToLayer = (layer: 'main' | TFilterKey) => {
    setCurrentLayer(layer);
  };

  const handleBackToMain = () => {
    setCurrentLayer('main');
  };

  const handleClose = () => {
    setCurrentLayer('main');
    close();
  };

  const renderFilterLayer = (category: FilterCategoryConfig<TFilterKey>) => {
    const options = filterOptions[category.id] || [];
    const value = filterValues[category.id];
    const sliderRange = sliderRanges?.[category.id];

    if (options.length === 0 && category.selectType !== SelectVariant.Slider) {
      return null;
    }

    if (
      category.selectType === SelectVariant.Slider &&
      sliderRange &&
      sliderRange.min === sliderRange.max
    ) {
      return null;
    }

    const getSelectProps = (): SelectProps<TData> => {
      const baseProps = {
        label: category.label,
        title: category.label,
        'data-testid': category.testId,
        displayMode: SelectDisplayMode.Drawer,
        showTrigger: false,
        open: currentLayer === category.id,
        onClose: handleClose,
        onBack: handleBackToMain,
      };

      if (category.selectType === SelectVariant.Slider && sliderRange) {
        return {
          ...baseProps,
          options: [] as never[],
          value: value as number[],
          onChange: (newValue: number[]) =>
            onFilterChange(category.id, newValue),
          variant: SelectVariant.Slider,
          min: sliderRange.min,
          max: sliderRange.max,
        } as SelectProps<TData>;
      }

      if (category.selectType === SelectVariant.Multi) {
        return {
          ...baseProps,
          options: options as SelectOption<string>[],
          value: value as string[],
          onChange: (newValue: string[]) =>
            onFilterChange(category.id, newValue),
          filterBy: category.id as string,
          variant: SelectVariant.Multi,
        } as SelectProps<TData>;
      }

      return {
        ...baseProps,
        options: options as SelectOption<string>[],
        value: value as string,
        onChange: (newValue: string) => onFilterChange(category.id, newValue),
        variant: SelectVariant.Single,
      } as SelectProps<TData>;
    };

    return <Select {...getSelectProps()} />;
  };

  return (
    <>
      {hasFilterApplied && (
        <GenericFilterDrawerIconButton
          onClick={onClearAll}
          data-testid="earn-filter-clear-filters-button"
        >
          <DeleteOutlineIcon sx={{ height: 22, width: 22 }} />
        </GenericFilterDrawerIconButton>
      )}
      <GenericFilterDrawerIconButton onClick={open}>
        {hasFilterApplied && <SelectBadge label={filtersCount.toString()} />}
        <TuneRoundedIcon sx={{ height: 22, width: 22 }} />
      </GenericFilterDrawerIconButton>

      <FullScreenDrawer
        isOpen={isOpen}
        onClose={handleClose}
        title={currentLayer === 'main' ? drawerTitle : ''}
        showBackButton={currentLayer !== 'main'}
      >
        {currentLayer === 'main' && (
          <>
            <Stack direction="column" width="100%" gap={1} sx={{ flex: 1 }}>
              {categories.map((category) => {
                const sliderRange = sliderRanges?.[category.id];
                const badgeLabel = getDefaultBadgeLabel(
                  category,
                  filterValues[category.id],
                  sliderRange,
                );

                return (
                  <FilterCategoryItem
                    key={category.id}
                    category={category}
                    badgeLabel={badgeLabel}
                    onNavigate={handleNavigateToLayer}
                  />
                );
              })}
            </Stack>

            <Stack direction="column" gap={2}>
              <GenericFilterDrawerDivider />
              <Stack direction="row" gap={1}>
                <GenericFilterDrawerAlphaButton
                  fullWidth
                  disabled={!hasFilterApplied}
                  onClick={onClearAll}
                  data-testid="generic-filter-clear-filters-button"
                >
                  {clearButtonLabel}
                </GenericFilterDrawerAlphaButton>
                <GenericFilterDrawerPrimaryButton
                  fullWidth
                  disabled={!hasFilterApplied}
                  onClick={handleClose}
                  data-testid="generic-filter-apply-filters-button"
                >
                  {applyButtonLabel}
                </GenericFilterDrawerPrimaryButton>
              </Stack>
            </Stack>
          </>
        )}

        {categories.map((category) => {
          if (currentLayer === category.id) {
            return renderFilterLayer(category);
          }
          return null;
        })}
      </FullScreenDrawer>

      {children}
    </>
  );
};
