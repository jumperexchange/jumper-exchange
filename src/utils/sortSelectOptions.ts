import { sortBy } from 'lodash';

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export const sortSelectOptions = <T extends Option>(options: T[]): T[] => {
  return sortBy(options, 'label');
};
