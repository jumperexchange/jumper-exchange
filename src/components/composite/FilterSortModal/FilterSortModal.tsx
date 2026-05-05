import type { FC } from 'react';
import { useEffect, useImperativeHandle, useState } from 'react';
import type { MultiLayerProps } from '../MultiLayer/MultiLayer.types';
import { isLeafCategory } from '../MultiLayer/MultiLayer.types';
import Stack from '@mui/material/Stack';
import { LeafCategoryRenderer } from '../MultiLayer/components/LeafCategoryRenderer';
import { MultiLayerDrawerDivider } from '../MultiLayer/MultiLayer.styles';
import { CategoryListItem } from '../MultiLayer/components/CategoryListItem';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useFullScreenDrawer } from '@/components/core/FullScreenDrawer/hooks';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';
import { SelectBadge } from '@/components/core/form/Select/components/SelectBadge';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import {
  categoryListItemSx,
  categoryListSx,
  clearButtonSx,
  clearIconButtonSx,
  leafCategoryContainerSx,
  leafCategorySlotProps,
  sectionCardSx,
  selectBadgeSx,
} from './constants';

interface FilterSortModalProps extends Omit<MultiLayerProps, 'title'> {
  triggerButtonLabel?: string;
}

export const FilterSortModal: FC<FilterSortModalProps> = ({
  ref,
  categories,
  applyButtonLabel = 'Apply',
  clearButtonLabel = 'Clear',
  triggerButtonLabel = 'Filters & Sort',
  onApply,
  onClear,
  onClose,
  disableClear = false,
  disableApply = false,
  testId = 'multi-layer-modal',
  triggerButton,
  defaultTriggerSx,
  appliedFiltersCount,
}) => {
  const { isOpen, open, close } = useFullScreenDrawer();

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [open, close],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedCategory = categories[selectedIndex] ?? null;

  useEffect(() => {
    setSelectedIndex(0);
  }, [categories.length]);

  const handleClose = () => {
    onClose?.();
    close();
  };

  const handleApply = () => {
    onApply?.();
    close();
  };

  const handleClear = () => {
    onClear?.();
    close();
  };

  const hasFilterApplied = !!appliedFiltersCount;

  return (
    <>
      {triggerButton ? (
        triggerButton
      ) : (
        <Stack
          direction="row"
          sx={[
            {
              gap: 1,
            },
            ...(Array.isArray(defaultTriggerSx)
              ? defaultTriggerSx
              : [defaultTriggerSx]),
          ]}
        >
          {hasFilterApplied && (
            <IconButton
              size={Size.MD}
              variant={Variant.AlphaDark}
              onClick={onClear}
              data-testid={`${testId}-clear-button`}
              sx={clearIconButtonSx}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          )}
          <Button
            onClick={open}
            data-testid={`${testId}-trigger-button`}
            size={Size.MD}
            variant={Variant.AlphaDark}
            endAdornment={
              hasFilterApplied && (
                <SelectBadge
                  label={appliedFiltersCount.toString()}
                  sx={selectBadgeSx}
                />
              )
            }
          >
            {triggerButtonLabel}
          </Button>
        </Stack>
      )}
      <ModalContainer isOpen={isOpen} onClose={handleClose}>
        <SectionCard sx={sectionCardSx}>
          <Stack
            direction="row"
            sx={{
              gap: 4,
              flex: 1,
              minHeight: 0,
            }}
          >
            <Stack
              direction="column"
              sx={[
                {
                  gap: 1,
                },
                ...(Array.isArray(categoryListSx)
                  ? categoryListSx
                  : [categoryListSx]),
              ]}
            >
              {categories.map((category, index) => (
                <CategoryListItem
                  key={category.id}
                  category={category}
                  onClick={() => {
                    setSelectedIndex(index);
                  }}
                  sx={(theme) =>
                    categoryListItemSx(theme, selectedIndex === index)
                  }
                />
              ))}
            </Stack>

            <Stack direction="column" sx={leafCategoryContainerSx}>
              {selectedCategory && isLeafCategory(selectedCategory) ? (
                <LeafCategoryRenderer
                  category={selectedCategory}
                  slotProps={leafCategorySlotProps}
                />
              ) : null}
            </Stack>
          </Stack>

          <MultiLayerDrawerDivider />
          <Stack
            direction="row"
            sx={{
              gap: 2,
            }}
          >
            <Button
              disabled={disableClear}
              onClick={handleClear}
              size={Size.LG}
              variant={Variant.AlphaDark}
              data-testid={`${testId}-clear-all-button`}
              sx={clearButtonSx}
            >
              {clearButtonLabel}
            </Button>
            <Button
              fullWidth
              size={Size.LG}
              variant={Variant.Primary}
              disabled={disableApply}
              onClick={handleApply}
              data-testid={`${testId}-apply-button`}
            >
              {applyButtonLabel}
            </Button>
          </Stack>
        </SectionCard>
      </ModalContainer>
    </>
  );
};
