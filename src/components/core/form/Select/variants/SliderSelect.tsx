import { useCallback, useMemo } from 'react';
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

export const SliderSelect = <T extends number[]>({
  value: initialValue,
  label: initialLabel,
  min,
  max,
  debounceMs,
  onChange,
  ...rest
}: SliderSelectProps<T>) => {
  const { t } = useTranslation();
  const fallbackValue = useMemo(() => [min, max] as unknown as T, [min, max]);
  const { value, setValue, handleChange, handleDebounceChange } = useSelect(
    initialValue?.length > 0 ? initialValue : fallbackValue,
    onChange,
    debounceMs,
  );

  const formatValue = useCallback((value: T) => {
    return value.join(' - ');
  }, []);

  const isValueSelected = useMemo(() => {
    return formatValue(value) !== formatValue(fallbackValue);
  }, [value, fallbackValue, formatValue]);

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

  return (
    <SelectBase
      {...rest}
      value={value}
      onChange={handleChange}
      multiple={false}
      selectorContent={
        <>
          <SelectorLabel label={initialLabel} />
          {isValueSelected && <SelectBadge label={formatValue(value)} />}
        </>
      }
    >
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyXSmallStrong">
          {`${formatValue(value)} ${initialLabel}`}
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
          />
          <StyledSliderRangeContainer>
            <Typography variant="bodyXSmall">{min}</Typography>
            <Typography variant="bodyXSmall">{max}</Typography>
          </StyledSliderRangeContainer>
        </StyledSliderContainer>
      </StyledMultiSelectFiltersContainer>
    </SelectBase>
  );
};
