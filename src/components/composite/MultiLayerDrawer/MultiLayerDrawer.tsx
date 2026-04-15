import { useImperativeHandle } from 'react';
import { FullScreenDrawer } from 'src/components/core/FullScreenDrawer/FullScreenDrawer';
import { useFullScreenDrawer } from 'src/components/core/FullScreenDrawer/hooks';
import Stack from '@mui/material/Stack';
import type { MultiLayerProps } from '../MultiLayer/MultiLayer.types';
import { CategoryListItem } from '../MultiLayer/components/CategoryListItem';
import { LeafCategoryRenderer } from '../MultiLayer/components/LeafCategoryRenderer';
import {
  MultiLayerDrawerAlphaButton,
  MultiLayerDrawerDivider,
  MultiLayerDrawerIconButton,
  MultiLayerDrawerPrimaryButton,
} from '../MultiLayer/MultiLayer.styles';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useMultiLayerNavigation } from '../MultiLayer/hooks';
import { SelectBadge } from '@/components/core/form/Select/components/SelectBadge';

/**
 * MultiLayerDrawer - A generic drawer component that supports multi-level navigation
 *
 * Categories can either:
 * - Have no subcategories
 * - Have subcategories (branch node)
 * - Be a leaf with content type (leaf node) - renders specific content
 *
 * Supports unlimited nesting depth through recursive category structure.
 */
export const MultiLayerDrawer: React.FC<MultiLayerProps> = ({
  ref,
  categories,
  title,
  applyButtonLabel = 'Apply',
  clearButtonLabel = 'Clear',
  onApply,
  onClear,
  onClose,
  disableClear = false,
  disableApply = false,
  testId = 'multi-layer-drawer',
  showFooter = true,
  defaultTriggerSx,
  triggerButton,
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

  const {
    isRootLevel,
    currentCategories,
    breadcrumbLabel,
    currentLeafCategory,
    navigateTo,
    goBack,
    reset,
  } = useMultiLayerNavigation(categories);

  const handleClose = () => {
    reset();
    onClose?.();
    close();
  };

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onApply?.();
    close();
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
            <MultiLayerDrawerIconButton
              onClick={onClear}
              data-testid={`${testId}-clear-button`}
            >
              <DeleteOutlinedIcon sx={{ height: 22, width: 22 }} />
            </MultiLayerDrawerIconButton>
          )}
          <MultiLayerDrawerIconButton
            onClick={open}
            data-testid={`${testId}-trigger-button`}
          >
            {hasFilterApplied && (
              <SelectBadge label={appliedFiltersCount.toString()} />
            )}
            <TuneRoundedIcon sx={{ height: 22, width: 22 }} />
          </MultiLayerDrawerIconButton>
        </Stack>
      )}
      <FullScreenDrawer
        isOpen={isOpen}
        onClose={handleClose}
        title={isRootLevel ? title : breadcrumbLabel}
        showBackButton={!isRootLevel}
        onBack={goBack}
      >
        {/* Main content area */}
        <Stack
          direction="column"
          sx={{
            width: '100%',
            gap: 2,
            flex: 1,
          }}
        >
          {currentLeafCategory ? (
            // Render leaf category content
            <LeafCategoryRenderer category={currentLeafCategory} />
          ) : (
            // Render category list
            currentCategories.map((category, index) => (
              <CategoryListItem
                key={category.id}
                category={category}
                onClick={() => navigateTo(index)}
              />
            ))
          )}
        </Stack>

        {/* Footer buttons - only show at root level */}
        {isRootLevel && showFooter && (
          <Stack
            direction="column"
            sx={{
              gap: 2,
            }}
          >
            <MultiLayerDrawerDivider />
            <Stack
              direction="row"
              sx={{
                gap: 1,
              }}
            >
              <MultiLayerDrawerAlphaButton
                fullWidth
                disabled={disableClear}
                onClick={handleClear}
                data-testid={`${testId}-clear-all-button`}
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
          </Stack>
        )}
      </FullScreenDrawer>
    </>
  );
};
