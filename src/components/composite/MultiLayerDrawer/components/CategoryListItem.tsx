import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Stack from '@mui/material/Stack';
import {
  CategoryConfig,
  hasSubcategories,
  isLeafCategory,
} from '../MultiLayerDrawer.types';
import {
  CategoryListItemContainer,
  CategoryListItemContent,
  CategoryListItemLabel,
  CategoryListItemBadge,
} from '../MultiLayerDrawer.styles';

export interface CategoryListItemProps {
  category: CategoryConfig;
  onClick: () => void;
}

/**
 * CategoryListItem - Renders a single category in the list
 *
 * Shows:
 * - Icon (if provided)
 * - Label
 * - Badge (if provided)
 * - Chevron > icon (if category is navigable - has subcategories or is a leaf category)
 */
export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  onClick,
}) => {
  // Show chevron for both subcategories and leaf categories (both are navigable)
  const showChevron = hasSubcategories(category) || isLeafCategory(category);

  return (
    <CategoryListItemContainer onClick={onClick} data-testid={category.testId}>
      <CategoryListItemContent>
        {category.icon && <Stack sx={{ flexShrink: 0 }}>{category.icon}</Stack>}
        <CategoryListItemLabel>{category.label}</CategoryListItemLabel>
      </CategoryListItemContent>

      <Stack direction="row" gap={1} alignItems="center">
        {category.badgeLabel && (
          <CategoryListItemBadge>{category.badgeLabel}</CategoryListItemBadge>
        )}
        {showChevron && (
          <ChevronRightRoundedIcon
            sx={{
              height: 24,
              width: 24,
              color: 'text.secondary',
            }}
          />
        )}
      </Stack>
    </CategoryListItemContainer>
  );
};
