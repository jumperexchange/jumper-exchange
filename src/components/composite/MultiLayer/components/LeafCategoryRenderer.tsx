import type {
  LeafCategory,
  BaseCategoryConfig,
  RendererSlotProps,
} from '../MultiLayer.types';
import { CategoryContentType } from '../MultiLayer.types';
import { MultiSelectView } from '../views/MultiSelectView';
import { SingleSelectView } from '../views/SingleSelectView';
import { SliderView } from '../views/SliderView';
import { ListView } from '../views/ListView';
import { DateRangeView } from '../views/DateRangeView';

export interface LeafCategoryRendererProps<TValue> {
  category: LeafCategory<TValue>;
  slotProps?: RendererSlotProps;
}

export const LeafCategoryRenderer = <TValue,>({
  category,
  slotProps,
}: LeafCategoryRendererProps<TValue>) => {
  switch (category.contentType) {
    case CategoryContentType.MultiSelect:
      return <MultiSelectView category={category} slotProps={slotProps} />;

    case CategoryContentType.SingleSelect:
      return <SingleSelectView category={category} slotProps={slotProps} />;

    case CategoryContentType.Slider:
      return <SliderView category={category} slotProps={slotProps} />;

    case CategoryContentType.DateRange:
      return <DateRangeView category={category} slotProps={slotProps} />;

    case CategoryContentType.List:
      return <ListView category={category} />;

    case CategoryContentType.Custom:
      if (category.render) {
        return (
          <>
            {category.render({
              value: category.value,
              onChange: category.onChange || (() => {}),
              category,
            })}
          </>
        );
      }
      return null;

    default:
      console.warn(
        `Unknown content type for category: ${(category as unknown as BaseCategoryConfig).id}`,
      );
      return null;
  }
};
