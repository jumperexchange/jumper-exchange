import type { DataItem } from 'src/types';

export const sortByName = (data: DataItem[]): DataItem[] => {
  return data?.sort(function (a: DataItem, b: DataItem) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};
