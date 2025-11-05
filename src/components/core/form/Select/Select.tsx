import {
  SelectProps,
  SelectVariant,
  MultiSelectProps,
  SingleSelectProps,
  SliderSelectProps,
} from './Select.types';
import { MultiSelect } from './variants/MultiSelect';
import { SingleSelect } from './variants/SingleSelect';
import { SliderSelect } from './variants/SliderSelect';

export const Select = <T extends string | string[]>({
  variant,
  ...props
}: SelectProps<T>) => {
  if (variant === SelectVariant.Single) {
    return (
      <SingleSelect {...(props as unknown as SingleSelectProps<string>)} />
    );
  }

  if (variant === SelectVariant.Slider) {
    return (
      <SliderSelect {...(props as unknown as SliderSelectProps<number[]>)} />
    );
  }

  return <MultiSelect {...(props as unknown as MultiSelectProps<string[]>)} />;
};
