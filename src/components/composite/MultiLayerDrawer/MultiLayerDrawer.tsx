import { useState } from 'react';
import { FullScreenDrawer } from 'src/components/core/FullScreenDrawer/FullScreenDrawer';
import { useFullScreenDrawer } from 'src/components/core/FullScreenDrawer/hooks';
import Stack from '@mui/material/Stack';
import {
  MultiLayerDrawerProps,
  CategoryConfig,
  hasSubcategories,
  isLeafCategory,
  BreadcrumbItem,
} from './MultiLayerDrawer.types';
import { CategoryListItem } from './components/CategoryListItem';
import { LeafCategoryRenderer } from './components/LeafCategoryRenderer';
import {
  MultiLayerDrawerAlphaButton,
  MultiLayerDrawerDivider,
  MultiLayerDrawerIconButton,
  MultiLayerDrawerPrimaryButton,
} from './MultiLayerDrawer.styles';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { SelectBadge } from 'src/components/core/form/Select/components/SelectBadge';

/**
 * MultiLayerDrawer - A generic drawer component that supports multi-level navigation
 *
 * Categories can either:
 * - Have subcategories (branch node) - shows with > icon
 * - Be a leaf with content type (leaf node) - renders specific content
 *
 * Supports unlimited nesting depth through recursive category structure.
 */
export const MultiLayerDrawer: React.FC<MultiLayerDrawerProps> = ({
  categories,
  title,
  applyButtonLabel = 'Apply',
  clearButtonLabel = 'Clear',
  onApply,
  onClear,
  disableClear = false,
  disableApply = false,
  testId = 'multi-layer-drawer',
  showFooter = true,
}) => {
  const { isOpen, open, close } = useFullScreenDrawer();

  // Navigation stack: each item represents a level in the category tree
  const [navigationStack, setNavigationStack] = useState<CategoryConfig[][]>([
    categories,
  ]);

  // Breadcrumb trail for UI display
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Get current categories to display
  const currentCategories = navigationStack[navigationStack.length - 1];

  // Check if we're at root level
  const isRootLevel = navigationStack.length === 1;

  const handleNavigateToSubcategory = (category: CategoryConfig) => {
    if (hasSubcategories(category)) {
      // Navigate deeper into subcategories
      setNavigationStack([...navigationStack, category.subcategories]);
      setBreadcrumbs([
        ...breadcrumbs,
        { id: category.id, label: category.label },
      ]);
    } else if (isLeafCategory(category)) {
      // Navigate to leaf category detail view
      setNavigationStack([...navigationStack, [category]]);
      setBreadcrumbs([
        ...breadcrumbs,
        { id: category.id, label: category.label },
      ]);
    }
  };

  const handleBack = () => {
    if (!isRootLevel) {
      setNavigationStack(navigationStack.slice(0, -1));
      setBreadcrumbs(breadcrumbs.slice(0, -1));
    }
  };

  const handleClose = () => {
    // Reset navigation to root
    setNavigationStack([categories]);
    setBreadcrumbs([]);
    close();
  };

  const handleApply = () => {
    onApply?.();
    handleClose();
  };

  const handleClear = () => {
    onClear?.();
    close();
  };

  // Determine if current view shows a leaf category
  const currentLeafCategory =
    currentCategories.length === 1 && isLeafCategory(currentCategories[0])
      ? currentCategories[0]
      : null;

  // Calculate total applied filters count (sum all badge labels that are numbers)
  const totalFiltersCount = categories.reduce((count, category) => {
    const badgeValue = category.badgeLabel
      ? parseInt(category.badgeLabel, 10)
      : 0;
    return count + (isNaN(badgeValue) ? 0 : badgeValue);
  }, 0);

  const hasFiltersApplied = totalFiltersCount > 0;

  return (
    <>
      <Stack direction="row" gap={1}>
        <MultiLayerDrawerIconButton
          onClick={open}
          data-testid={`${testId}-trigger-button`}
        >
          {hasFiltersApplied && (
            <SelectBadge label={totalFiltersCount.toString()} />
          )}
          <TuneRoundedIcon sx={{ height: 22, width: 22 }} />
        </MultiLayerDrawerIconButton>
      </Stack>

      <FullScreenDrawer
        isOpen={isOpen}
        onClose={handleClose}
        title={
          isRootLevel ? title : breadcrumbs[breadcrumbs.length - 1]?.label || ''
        }
        showBackButton={!isRootLevel}
        onBack={handleBack}
      >
        {/* Main content area */}
        <Stack direction="column" width="100%" gap={1} sx={{ flex: 1 }}>
          {currentLeafCategory ? (
            // Render leaf category content
            <LeafCategoryRenderer category={currentLeafCategory} />
          ) : (
            // Render category list
            currentCategories.map((category) => (
              <CategoryListItem
                key={category.id}
                category={category}
                onClick={() => handleNavigateToSubcategory(category)}
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
