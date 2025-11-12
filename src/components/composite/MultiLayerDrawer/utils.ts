import {
  CategoryContentType,
  MultiSelectLeafCategory,
  SingleSelectLeafCategory,
  SliderLeafCategory,
  ListLeafCategory,
  CustomLeafCategory,
} from './MultiLayerDrawer.types';

export const createSingleSelectCategory = <TValue extends string | number>(
  config: Omit<SingleSelectLeafCategory<TValue>, 'contentType'>,
): SingleSelectLeafCategory<TValue> =>
  ({
    ...config,
    contentType: CategoryContentType.SingleSelect,
  }) as SingleSelectLeafCategory<TValue>;

export const createMultiSelectCategory = <TValue extends string | number>(
  config: Omit<MultiSelectLeafCategory<TValue>, 'contentType'>,
): MultiSelectLeafCategory<TValue> =>
  ({
    ...config,
    contentType: CategoryContentType.MultiSelect,
  }) as MultiSelectLeafCategory<TValue>;

export const createSliderCategory = (
  config: Omit<SliderLeafCategory, 'contentType'>,
): SliderLeafCategory => ({
  ...config,
  contentType: CategoryContentType.Slider,
});

export const createListCategory = <TValue>(
  config: Omit<ListLeafCategory<TValue>, 'contentType'>,
): ListLeafCategory<TValue> => ({
  ...config,
  contentType: CategoryContentType.List,
});

export const createCustomCategory = <TValue>(
  config: Omit<CustomLeafCategory<TValue>, 'contentType'>,
): CustomLeafCategory<TValue> => ({
  ...config,
  contentType: CategoryContentType.Custom,
});
