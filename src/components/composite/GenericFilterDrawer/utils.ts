import { SelectVariant } from 'src/components/core/form/Select/Select.types';
import { FilterCategoryConfig } from './GenericFilterDrawer.types';
import { formatSliderValue } from 'src/components/core/form/Select/utils';

export const getDefaultBadgeLabel = (
  category: FilterCategoryConfig,
  filterValue: any,
  sliderRange?: { min: number; max: number },
): string | null => {
  if (category.getBadgeLabel) {
    return category.getBadgeLabel(filterValue);
  }

  if (category.selectType === SelectVariant.Slider) {
    if (Array.isArray(filterValue) && sliderRange) {
      const [min, max] = filterValue;
      const { min: rangeMin, max: rangeMax } = sliderRange;

      if (min !== rangeMin || max !== rangeMax) {
        return formatSliderValue(filterValue);
      }
    }
    return null;
  }

  if (Array.isArray(filterValue) && filterValue.length > 0) {
    return filterValue.length.toString();
  }

  return null;
};
