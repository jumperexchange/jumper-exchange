import {
  LeafCategory,
  CategoryContentType,
  BaseCategoryConfig,
} from '../MultiLayerDrawer.types';
import { MultiSelectView } from '../views/MultiSelectView';
import { SingleSelectView } from '../views/SingleSelectView';
import { SliderView } from '../views/SliderView';
import { ListView } from '../views/ListView';

export interface LeafCategoryRendererProps<TValue> {
  category: LeafCategory<TValue>;
}

export const LeafCategoryRenderer = <TValue,>({
  category,
}: LeafCategoryRendererProps<TValue>) => {
  switch (category.contentType) {
    case CategoryContentType.MultiSelect:
      return <MultiSelectView category={category} />;

    case CategoryContentType.SingleSelect:
      return <SingleSelectView category={category} />;

    case CategoryContentType.Slider:
      return <SliderView category={category} />;

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
