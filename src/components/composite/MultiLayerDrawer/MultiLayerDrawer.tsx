import { useState, useMemo, useImperativeHandle } from 'react';
import { FullScreenDrawer } from 'src/components/core/FullScreenDrawer/FullScreenDrawer';
import { useFullScreenDrawer } from 'src/components/core/FullScreenDrawer/hooks';
import Stack from '@mui/material/Stack';
import {
  MultiLayerDrawerProps,
  CategoryConfig,
  hasSubcategories,
  isLeafCategory,
} from './MultiLayerDrawer.types';
import { CategoryListItem } from './components/CategoryListItem';
import { LeafCategoryRenderer } from './components/LeafCategoryRenderer';
import {
  MultiLayerDrawerFilterBadge,
  MultiLayerDrawerAlphaButton,
  MultiLayerDrawerDivider,
  MultiLayerDrawerIconButton,
  MultiLayerDrawerPrimaryButton,
} from './MultiLayerDrawer.styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

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
export const MultiLayerDrawer: React.FC<MultiLayerDrawerProps> = ({
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

  const [navigationPath, setNavigationPath] = useState<number[]>([]);

  const isRootLevel = navigationPath.length === 0;

  const { currentCategories, breadcrumbLabel } = useMemo(() => {
    if (navigationPath.length === 0) {
      return { currentCategories: categories, breadcrumbLabel: '' };
    }

    let current: CategoryConfig[] = categories;
    let label = '';

    for (let i = 0; i < navigationPath.length; i++) {
      const index = navigationPath[i];
      const category = current[index];

      if (!category) {
        // Invalid path, return root
        return { currentCategories: categories, breadcrumbLabel: '' };
      }

      label = category.label;

      if (hasSubcategories(category)) {
        current = category.subcategories;
      } else if (isLeafCategory(category)) {
        return { currentCategories: [category], breadcrumbLabel: label };
      }
    }

    return { currentCategories: current, breadcrumbLabel: label };
  }, [categories, navigationPath]);

  const handleNavigateToSubcategory = (categoryIndex: number) => {
    const category = currentCategories[categoryIndex];
    if (!category) return;

    if (hasSubcategories(category) || isLeafCategory(category)) {
      setNavigationPath([...navigationPath, categoryIndex]);
    }
  };

  const handleBack = () => {
    if (!isRootLevel) {
      setNavigationPath(navigationPath.slice(0, -1));
    }
  };

  const handleClose = () => {
    setNavigationPath([]);
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

  const currentLeafCategory =
    currentCategories.length === 1 && isLeafCategory(currentCategories[0])
      ? currentCategories[0]
      : null;

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
          <MultiLayerDrawerIconButton
            onClick={open}
            data-testid={`${testId}-trigger-button`}
          >
            {hasFilterApplied && (
              <MultiLayerDrawerFilterBadge
                label={appliedFiltersCount.toString()}
              />
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
        onBack={handleBack}
      >
        {/* Main content area */}
        <Stack direction="column" width="100%" gap={2} sx={{ flex: 1 }}>
          {currentLeafCategory ? (
            // Render leaf category content
            <LeafCategoryRenderer category={currentLeafCategory} />
          ) : (
            // Render category list
            currentCategories.map((category, index) => (
              <CategoryListItem
                key={category.id}
                category={category}
                onClick={() => handleNavigateToSubcategory(index)}
              />
            ))
          )}
        </Stack>

        {/* Footer buttons - only show at root level */}
        {isRootLevel && showFooter && (
          <Stack direction="column" gap={2}>
            <MultiLayerDrawerDivider />
            <Stack direction="row" gap={1}>
              <MultiLayerDrawerAlphaButton
                fullWidth
                disabled={disableClear}
                onClick={handleClear}
                data-testid={`${testId}-clear-button`}
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
