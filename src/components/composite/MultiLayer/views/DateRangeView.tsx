import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  DateRangeLeafCategory,
  RendererSlotProps,
} from '../MultiLayer.types';
import {
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersClearButton,
} from 'src/components/core/form/Select/Select.styles';

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
  const isValueSelected = from !== null || to !== null;

  const formattedRange = useMemo(() => formatDateRange(from, to), [from, to]);

  const handleFromChange = (date: Date | null) => {
    category.onChange?.([date, to]);
  };

  const handleToChange = (date: Date | null) => {
    category.onChange?.([from, date]);
  };

  const handleClear = () => {
    category.onChange?.([]);
  };

  return (
    <Stack direction="column" width="100%" gap={1}>
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyMediumStrong">
          {isValueSelected
            ? `${formattedRange} ${category.label}`
            : category.label}
        </Typography>
        <StyledMultiSelectFiltersClearButton
          disabled={!isValueSelected}
          size={clearButtonSize}
          data-testid={`${category.testId}-clear-button`}
          onClick={handleClear}
        >
          {t('earn.filter.clear')}
        </StyledMultiSelectFiltersClearButton>
      </StyledMultiSelectFiltersContainer>

      <StyledMultiSelectFiltersContainer
        sx={{ height: 'auto', padding: (theme) => theme.spacing(2) }}
      >
        <Stack
          direction="column"
          alignItems="center"
          gap={2}
          width="100%"
          sx={{ pointerEvents: 'auto' }}
        >
          <Stack direction="column" gap={0.25} flex={1}>
            <Typography variant="bodyXXSmallStrong" color="textSecondary">
              {t('common.from', 'From')}
            </Typography>
            <DatePicker
              value={from}
              minDate={category.min}
              maxDate={category.max}
              disableHighlightToday
              onChange={handleFromChange}
              slotProps={{
                openPickerButton: {
                  size: 'small',
                },
                openPickerIcon: {
                  fontSize: 'small',
                },
                textField: {
                  size: 'small',
                  variant: 'filled',
                  placeholder: t('common.from', 'From'),
                  inputProps: {
                    'data-testid': `${category.testId}-from-input`,
                  },
                  InputProps: { disableUnderline: true },
                },
              }}
              sx={(theme) => ({
                '& .MuiPickersFilledInput-root': {
                  borderRadius: theme.shape.inputTextBorderRadius,
                },
                '& .MuiPickersSectionList-root': {
                  paddingY: theme.spacing(1),
                  ...theme.typography.bodySmall,
                },
              })}
            />
          </Stack>
          <Stack direction="column" gap={0.25} flex={1}>
            <Typography variant="bodyXXSmallStrong" color="textSecondary">
              {t('common.to', 'To')}
            </Typography>
            <DatePicker
              value={to}
              minDate={category.min}
              maxDate={category.max}
              disableHighlightToday
              onChange={handleToChange}
              slotProps={{
                openPickerButton: {
                  size: 'small',
                },
                openPickerIcon: {
                  fontSize: 'small',
                },
                textField: {
                  size: 'small',
                  variant: 'filled',
                  placeholder: t('common.to', 'To'),
                  inputProps: { 'data-testid': `${category.testId}-to-input` },
                  InputProps: { disableUnderline: true },
                },
              }}
              sx={(theme) => ({
                '& .MuiPickersFilledInput-root': {
                  borderRadius: theme.shape.inputTextBorderRadius,
                },
                '& .MuiPickersSectionList-root': {
                  paddingY: theme.spacing(1),
                  ...theme.typography.bodySmall,
                },
              })}
            />
          </Stack>
        </Stack>
      </StyledMultiSelectFiltersContainer>
    </Stack>
  );
};
