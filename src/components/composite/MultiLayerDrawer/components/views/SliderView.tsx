import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LeafCategory } from '../../MultiLayerDrawer.types';
import {
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersClearButton,
  StyledSlider,
  StyledSliderContainer,
  StyledSliderRangeContainer,
} from 'src/components/core/form/Select/Select.styles';
import { useTranslation } from 'react-i18next';
import { formatSliderValue } from 'src/components/core/form/Select/utils';

export interface SliderViewProps {
  category: LeafCategory<number[]>;
}

/**
 * SliderView - Renders a range slider
 *
 * Features:
 * - Shows current range value
 * - Clear button to reset to min/max
 * - Formatted display of values
 */
export const SliderView: React.FC<SliderViewProps> = ({ category }) => {
  const { t } = useTranslation();

  const min = category.min ?? 0;
  const max = category.max ?? 100;
  const value = category.value || [min, max];

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

  return (
    <Stack direction="column" width="100%" gap={1}>
      {/* Header with current value and clear button */}
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyXSmallStrong">
          {`${formatSliderValue(value)} ${category.label}`}
        </Typography>
        <StyledMultiSelectFiltersClearButton
          disabled={!isValueSelected}
          size="small"
          data-testid={`${category.testId}-clear-button`}
          onClick={handleClear}
        >
          {t('earn.filter.clear')}
        </StyledMultiSelectFiltersClearButton>
      </StyledMultiSelectFiltersContainer>

      {/* Slider */}
      <StyledMultiSelectFiltersContainer sx={{ height: 'auto' }}>
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
            <Typography variant="bodyXSmall">{min}</Typography>
            <Typography variant="bodyXSmall">{max}</Typography>
          </StyledSliderRangeContainer>
        </StyledSliderContainer>
      </StyledMultiSelectFiltersContainer>
    </Stack>
  );
};
