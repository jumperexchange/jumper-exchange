import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type {
  RendererSlotProps,
  SliderLeafCategory,
} from '../MultiLayer.types';
import {
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersClearButton,
  StyledSlider,
  StyledSliderContainer,
  StyledSliderRangeContainer,
} from 'src/components/core/form/Select/Select.styles';
import { useTranslation } from 'react-i18next';
import { formatSliderValue } from 'src/components/core/form/Select/utils';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import { useMemo } from 'react';

export interface SliderViewProps {
  category: SliderLeafCategory;
  slotProps?: RendererSlotProps;
}

export const SliderView: React.FC<SliderViewProps> = ({
  category,
  slotProps,
}) => {
  const { t } = useTranslation();

  const min = category.min ?? 0;
  const max = category.max ?? 100;
  const value = category.value || [min, max];
  const [displayMin, displayMax] = [min, max].map((v) =>
    toFixedFractionDigits(v, 0, 2),
  );

  const clearButtonSize = slotProps?.clearButtonSize ?? 'medium';

  const isValueSelected = value[0] !== min || value[1] !== max;

  const handleRangeChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && category.onChange) {
      category.onChange(newValue);
    }
  };

  const handleClear = () => {
    if (category.onChange) {
      category.onChange([min, max]);
    }
  };

  const formattedValue = useMemo(() => {
    return value.map((v: number) => toFixedFractionDigits(v, 0, 2));
  }, [value]);

  const renderHeader = () => {
    const displayValue = formatSliderValue(formattedValue);

    if (!displayValue) {
      return category.label;
    }

    if (!category.renderLabel) {
      return `${displayValue} ${category.label}`;
    }

    return `${displayValue} ${category.renderLabel(value)}`;
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
        <Typography variant="bodyMediumStrong">{renderHeader()}</Typography>
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
        <StyledSliderContainer>
          <StyledSlider
            getAriaLabel={() => `${category.label} range`}
            value={value}
            onChange={handleRangeChange}
            valueLabelDisplay="off"
            min={min}
            max={max}
          />
          <StyledSliderRangeContainer>
            <Typography variant="bodyXSmall">
              {category.renderLabel
                ? `${displayMin} ${category.renderLabel?.(min)}`
                : displayMin}
            </Typography>
            <Typography variant="bodyXSmall">
              {category.renderLabel
                ? `${displayMax} ${category.renderLabel?.(max)}`
                : displayMax}
            </Typography>
          </StyledSliderRangeContainer>
        </StyledSliderContainer>
      </StyledMultiSelectFiltersContainer>
    </Stack>
  );
};
