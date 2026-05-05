import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DateRange } from 'react-day-picker';
import type {
  DateRangeLeafCategory,
  RendererSlotProps,
} from '../MultiLayer.types';
import {
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersClearButton,
  StyledDayPicker,
} from 'src/components/core/form/Select/Select.styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';

export interface DateRangeViewProps {
  category: DateRangeLeafCategory;
  slotProps?: RendererSlotProps;
}

function formatDateRange(from: Date | null, to: Date | null): string {
  const fmt = (d: Date) => format(d, 'dd MMM yy');
  if (from && to) {
    return `${fmt(from)} – ${fmt(to)}`;
  }
  if (from) {
    return `From ${fmt(from)}`;
  }
  if (to) {
    return `Until ${fmt(to)}`;
  }
  return '';
}

export const DateRangeView: React.FC<DateRangeViewProps> = ({
  category,
  slotProps,
}) => {
  const { t } = useTranslation();

  const [from, to] = category.value ?? [null, null];

  const clearButtonSize = slotProps?.clearButtonSize ?? 'medium';
  const isValueSelected = !!from || !!to;
  const isDefaultRange =
    from?.getTime() === category.min.getTime() &&
    to?.getTime() === category.max.getTime();
  const canClear = !isDefaultRange && isValueSelected;

  const formattedRange = useMemo(() => formatDateRange(from, to), [from, to]);

  const handleRangeChange = (range: DateRange | undefined) => {
    category.onChange?.([range?.from ?? null, range?.to ?? null]);
  };

  const handleClear = () => {
    category.onChange?.([category.min, category.max]);
  };

  return (
    <Stack
      direction="column"
      sx={{
        width: '100%',
        gap: 1,
      }}
    >
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyMediumStrong">
          {canClear ? formattedRange || category.label : category.label}
        </Typography>
        <StyledMultiSelectFiltersClearButton
          disabled={!canClear}
          size={clearButtonSize}
          data-testid={`${category.testId}-clear-button`}
          onClick={handleClear}
        >
          {t('earn.filter.clear')}
        </StyledMultiSelectFiltersClearButton>
      </StyledMultiSelectFiltersContainer>
      <StyledMultiSelectFiltersContainer
        sx={{
          height: 'auto',
          pointerEvents: 'auto',
          paddingY: 2,
          paddingX: 0,
        }}
      >
        <StyledDayPicker
          mode="range"
          selected={{
            from: from ?? undefined,
            to: to ?? undefined,
          }}
          components={{
            Chevron: ({ orientation }) =>
              orientation === 'left' ? (
                <IconButton>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton>
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              ),
          }}
          showOutsideDays
          onSelect={handleRangeChange}
          navLayout="around"
          resetOnSelect
          disabled={{
            before: category.min,
            after: category.max,
          }}
          defaultMonth={category.max}
          modifiersClassNames={{ today: '' }}
          data-testid={category.testId}
        />
      </StyledMultiSelectFiltersContainer>
    </Stack>
  );
};
