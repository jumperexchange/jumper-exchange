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
  MultiLayerDrawerFilterBadge,
} from '../MultiLayerDrawer.styles';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

export interface CategoryListItemProps {
  category: CategoryConfig;
  onClick: () => void;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  onClick,
}) => {
  const router = useRouter();
  const showChevron = hasSubcategories(category) || isLeafCategory(category);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (category.href) {
      router.push(category.href);
    } else if (category.onClick) {
      category.onClick();
    } else {
      onClick();
    }
  };

  return (
    <CategoryListItemContainer
      onClick={handleClick}
      data-testid={category.testId}
      disableRipple
    >
      <CategoryListItemContent>
        {category.icon && <Stack sx={{ flexShrink: 0 }}>{category.icon}</Stack>}
        <Typography variant="bodyMedium">{category.label}</Typography>
      </CategoryListItemContent>

      <Stack direction="row" gap={1} alignItems="center">
        {category.badgeLabel && (
          <MultiLayerDrawerFilterBadge label={category.badgeLabel} />
        )}
        {showChevron && <ChevronRightRoundedIcon />}
      </Stack>
    </CategoryListItemContainer>
  );
};
