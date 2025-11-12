import { ColumnDefinition } from './ColumnTable.types';

export const createEmptyColumn = <TData = any>(
  id: string,
  gridProps?: ColumnDefinition<TData>['gridProps'],
): ColumnDefinition<TData> => ({
  id,
  header: '',
  render: () => null,
  gridProps: gridProps || { size: 'grow' },
});
