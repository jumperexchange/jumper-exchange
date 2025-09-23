import {
  SelectProps,
  SelectVariant,
  MultiSelectProps,
  SingleSelectProps,
} from './Select.types';
import { MultiSelect } from './variants/MultiSelect';
import { SingleSelect } from './variants/SingleSelect';

export const Select = <T extends string | string[]>({
  variant,
  ...props
}: SelectProps<T>) => {
  if (variant === SelectVariant.Single) {
    return (
      <SingleSelect {...(props as unknown as SingleSelectProps<string>)} />
    );
  }

  return <MultiSelect {...(props as unknown as MultiSelectProps<string[]>)} />;
};
