import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Stack from '@mui/material/Stack';
import type { CategoryConfig } from '../MultiLayer.types';
import { hasSubcategories, isLeafCategory } from '../MultiLayer.types';
import {
  CategoryListItemContainer,
  CategoryListItemContent,
  MultiLayerDrawerFilterBadge,
} from '../MultiLayer.styles';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import type { SxProps, Theme } from '@mui/material/styles';

export interface CategoryListItemProps {
  category: CategoryConfig;
  onClick: () => void;
  sx?: SxProps<Theme>;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  onClick,
  sx,
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
      sx={sx}
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
