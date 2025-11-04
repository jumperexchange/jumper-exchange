import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { SelectBadge } from 'src/components/core/form/Select/components/SelectBadge';
import { FilterCategoryConfig } from './GenericFilterDrawer.types';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface FilterCategoryItemProps<TFilterKey extends string = string> {
  category: FilterCategoryConfig<TFilterKey>;
  badgeLabel: string | null;
  onNavigate: (layer: TFilterKey | 'main') => void;
}

export const FilterCategoryItem = <TFilterKey extends string = string>({
  category,
  badgeLabel,
  onNavigate,
}: FilterCategoryItemProps<TFilterKey>) => {
  return (
    <Box
      onClick={() => onNavigate(category.id)}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: (theme) => theme.spacing(0.75, 1),
        cursor: 'pointer',
      }}
    >
      <Stack direction="column" flex={1}>
        <Typography variant="bodyMedium">{category.label}</Typography>
      </Stack>
      <Stack direction="row" gap={1} alignItems="center">
        {badgeLabel && <SelectBadge label={badgeLabel} />}
        <ChevronRightIcon />
      </Stack>
    </Box>
  );
};
