import Stack from '@mui/material/Stack';
import { LeafCategory } from '../../MultiLayerDrawer.types';

export interface ListViewProps {
  category: LeafCategory<any>;
}

/**
 * ListView - Renders a custom list of items
 *
 * Features:
 * - Uses custom renderItem function provided in category config
 * - Flexible for any list-based content
 */
export const ListView: React.FC<ListViewProps> = ({ category }) => {
  const items = category.items || [];

  if (!category.renderItem) {
    console.warn(
      `ListView requires renderItem function for category: ${category.id}`,
    );
    return null;
  }

  return (
    <Stack direction="column" spacing={1} sx={{ flex: 1, overflowY: 'auto' }}>
      {items.map((item, index) => (
        <div key={index}>{category.renderItem!(item, index)}</div>
      ))}
    </Stack>
  );
};
