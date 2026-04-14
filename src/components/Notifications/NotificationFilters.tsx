'use client';

import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import type { SxProps, Theme } from '@mui/material/styles';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import type { NotificationCategory } from '@/types/notifications';
import type { DateFilter } from '@/hooks/notifications/useFilteredNotifications';
import { FilterRow } from './Notifications.style';

const CATEGORY_KEYS = [
  'all',
  'product',
  'campaign',
  'earn',
  'portfolio',
] as const;
const DATE_KEYS = ['all', 'today', 'week', 'month'] as const;

type CategoryFilterValue = (typeof CATEGORY_KEYS)[number];
type DateFilterValue = (typeof DATE_KEYS)[number];

interface NotificationFiltersProps {
  categoryFilter: NotificationCategory | null;
  setCategoryFilter: (category: NotificationCategory | null) => void;
  dateFilter: DateFilter;
  setDateFilter: (date: DateFilter) => void;
  sx?: SxProps<Theme>;
}

export const NotificationFilters: FC<NotificationFiltersProps> = ({
  categoryFilter,
  setCategoryFilter,
  dateFilter,
  setDateFilter,
  sx,
}) => {
  const { t } = useTranslation();

  const categoryOptions = useMemo(
    () =>
      CATEGORY_KEYS.map((key) => ({
        value: key,
        label: t(`notifications.categories.${key}`),
      })),
    [t],
  );

  const dateOptions = useMemo(
    () =>
      DATE_KEYS.map((key) => ({
        value: key,
        label: t(`notifications.dateFilter.${key}`),
      })),
    [t],
  );

  const categoryValue: CategoryFilterValue = categoryFilter ?? 'all';

  return (
    <FilterRow sx={sx}>
      <Select
        options={categoryOptions}
        value={categoryValue}
        onChange={(value) =>
          setCategoryFilter(
            value === 'all' ? null : (value as NotificationCategory),
          )
        }
        variant={SelectVariant.Single}
        labelIcon={<LocalOfferOutlined />}
        debounceMs={0}
        menuSx={{ zIndex: 1700 }}
      />
      <Select
        options={dateOptions}
        value={dateFilter as DateFilterValue}
        onChange={(value) => setDateFilter(value as DateFilter)}
        variant={SelectVariant.Single}
        labelIcon={<CalendarTodayOutlined />}
        debounceMs={0}
        menuSx={{ zIndex: 1700 }}
        menuPlacementX="right"
      />
    </FilterRow>
  );
};
