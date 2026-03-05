import type { FC } from 'react';
import { useImperativeHandle, useState } from 'react';
import type { MultiLayerProps } from '../MultiLayer/MultiLayer.types';
import { isLeafCategory } from '../MultiLayer/MultiLayer.types';
import Stack from '@mui/material/Stack';
import { LeafCategoryRenderer } from '../MultiLayer/components/LeafCategoryRenderer';
import {
  MultiLayerDrawerAlphaButton,
  MultiLayerDrawerDivider,
  MultiLayerDrawerFilterBadge,
  MultiLayerDrawerIconButton,
  MultiLayerDrawerPrimaryButton,
} from '../MultiLayer/MultiLayer.styles';
import { CategoryListItem } from '../MultiLayer/components/CategoryListItem';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useFullScreenDrawer } from '@/components/core/FullScreenDrawer/hooks';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';

interface FilterSortModalProps extends MultiLayerProps {
  triggerButtonLabel?: string;
}

export const FilterSortModal: FC<FilterSortModalProps> = ({
  ref,
  categories,
  title,
  applyButtonLabel = 'Apply',
  clearButtonLabel = 'Clear',
  triggerButtonLabel = 'Filters & Sort',
  onApply,
  onClear,
  onClose,
  disableClear = false,
  disableApply = false,
  testId = 'multi-layer-modal',
  showFooter = true,
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
        <Stack direction="row" gap={1} sx={defaultTriggerSx}>
          {hasFilterApplied && (
            <MultiLayerDrawerIconButton
              onClick={onClear}
              data-testid={`${testId}-clear-button`}
            >
              <DeleteOutlineIcon sx={{ height: 22, width: 22 }} />
            </MultiLayerDrawerIconButton>
          )}
          <MultiLayerDrawerAlphaButton
            onClick={open}
            data-testid={`${testId}-trigger-button`}
            size="medium"
            endIcon={
              hasFilterApplied && (
                <MultiLayerDrawerFilterBadge
                  label={appliedFiltersCount.toString()}
                />
              )
            }
            sx={{ paddingX: 2 }}
          >
            {triggerButtonLabel}
          </MultiLayerDrawerAlphaButton>
        </Stack>
      )}
      <ModalContainer isOpen={isOpen} onClose={handleClose}>
        <SectionCard
          sx={{
            maxHeight: `calc(100vh - 10rem)`,
            height: 570,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Stack direction="row" sx={{ flex: 1, minHeight: 0 }} gap={4}>
            <Stack
              direction="column"
              gap={1}
              sx={{
                width: 200,
                overflowY: 'auto',
              }}
            >
              {categories.map((category, index) => (
                <CategoryListItem
                  key={category.id}
                  category={category}
                  onClick={() => {
                    console.log('clicked', index);
                    setSelectedIndex(index);
                  }}
                  sx={(theme) => ({
                    background:
                      selectedIndex === index
                        ? (theme.vars || theme).palette.surface1Hover
                        : 'transparent',
                    transform: 'background 2s ease-in',
                    borderRadius: theme.shape.radius24,
                    padding: theme.spacing(1.125, 1.25, 1.125, 2.25),
                    '& svg': {
                      height: 22,
                      width: 22,
                    },
                  })}
                />
              ))}
            </Stack>

            <Stack
              direction="column"
              sx={(theme) => ({
                width: 264,
                '& .MuiStack-root': {
                  overflowY: 'auto',
                  '& .MuiInputBase-root': {
                    ...theme.typography.bodySmall,
                    fontWeight: 500,
                    height: 40,
                    '& svg': {
                      height: 20,
                      width: 20,
                    },
                  },
                  '& .MuiButtonBase-root svg:last-of-type': {
                    height: 16,
                    width: 16,
                  },
                },
              })}
            >
              {selectedCategory && isLeafCategory(selectedCategory) ? (
                <LeafCategoryRenderer category={selectedCategory} />
              ) : null}
            </Stack>
          </Stack>

          <MultiLayerDrawerDivider />
          <Stack direction="row" gap={2}>
            <MultiLayerDrawerAlphaButton
              fullWidth
              disabled={disableClear}
              onClick={handleClear}
              data-testid={`${testId}-clear-button`}
              sx={{ width: 108 }}
            >
              {clearButtonLabel}
            </MultiLayerDrawerAlphaButton>
            <MultiLayerDrawerPrimaryButton
              fullWidth
              disabled={disableApply}
              onClick={handleApply}
              data-testid={`${testId}-apply-button`}
            >
              {applyButtonLabel}
            </MultiLayerDrawerPrimaryButton>
          </Stack>
        </SectionCard>
      </ModalContainer>
    </>
  );
};
