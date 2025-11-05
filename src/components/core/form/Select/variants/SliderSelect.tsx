import { useCallback, useEffect, useMemo } from 'react';
import { SelectBase } from '../components/SelectBase';
import { SelectorLabel } from '../components/SelectLabel';
import { useSelect } from '../hooks';
import {
  StyledMultiSelectFiltersClearButton,
  StyledMultiSelectFiltersContainer,
  StyledSlider,
  StyledSliderContainer,
  StyledSliderRangeContainer,
} from '../Select.styles';
import { SliderSelectProps } from '../Select.types';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { SelectBadge } from '../components/SelectBadge';
import { formatSliderValue } from '../utils';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';

export const SliderSelect = <T extends number[]>({
  value: initialValue,
  label: initialLabel,
  title,
  min,
  max,
  debounceMs,
  onChange,
  ...rest
}: SliderSelectProps<T>) => {
  const { t } = useTranslation();
  const fallbackValue = useMemo(() => [min, max] as unknown as T, [min, max]);
  const defaultValue = useMemo(
    () => (initialValue?.length > 0 ? initialValue : fallbackValue),
    [initialValue, fallbackValue],
  );
  const { value, setValue, handleChange, handleDebounceChange } = useSelect(
    defaultValue,
    onChange,
    debounceMs,
  );

  const [displayMin, displayMax] = [min, max].map((v) =>
    toFixedFractionDigits(v, 0, 2),
  );

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const isValueSelected = useMemo(() => {
    return formatSliderValue(value) !== formatSliderValue(fallbackValue);
  }, [value, fallbackValue]);

  const handleClear = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setValue(fallbackValue);
      handleDebounceChange(fallbackValue);
    },
    [handleDebounceChange, setValue, fallbackValue],
  );

  const handleRangeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      event.preventDefault();
      event.stopPropagation();
      setValue(newValue as unknown as T);
      handleDebounceChange(newValue as unknown as T);
    },
    [handleDebounceChange, setValue],
  );

  const formattedValue = useMemo(() => {
    return value.map((v) => toFixedFractionDigits(v, 0, 2));
  }, [value]);

  return (
    <SelectBase
      {...rest}
      value={''}
      onChange={handleChange}
      multiple={false}
      selectorContent={
        <>
          <SelectorLabel label={initialLabel} />
          {isValueSelected && (
            <SelectBadge label={formatSliderValue(formattedValue)} />
          )}
        </>
      }
    >
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyXSmallStrong">
          {`${formatSliderValue(formattedValue)} ${initialLabel}`}
        </Typography>
        <StyledMultiSelectFiltersClearButton
          disabled={!isValueSelected}
          size="small"
          onClick={handleClear}
        >
          {t('earn.filter.clear')}
        </StyledMultiSelectFiltersClearButton>
      </StyledMultiSelectFiltersContainer>
      <StyledMultiSelectFiltersContainer sx={{ height: 'auto' }}>
        <StyledSliderContainer>
          <StyledSlider
            getAriaLabel={() => 'Temperature range'}
            value={value}
            onChange={handleRangeChange}
            valueLabelDisplay="off"
            min={min}
            max={max}
          />
          <StyledSliderRangeContainer>
            <Typography variant="bodyXSmall">{displayMin}</Typography>
            <Typography variant="bodyXSmall">{displayMax}</Typography>
          </StyledSliderRangeContainer>
        </StyledSliderContainer>
      </StyledMultiSelectFiltersContainer>
    </SelectBase>
  );
};
