import Stack from '@mui/material/Stack';
import type { ListLeafCategory } from '../MultiLayerDrawer.types';
import Box from '@mui/material/Box';

export interface ListViewProps<TValue> {
  category: ListLeafCategory<TValue>;
}

/**
 * @Note: This component can be used for the main menu
 * - Resources section with some re-working as in not requiring the renderItem function
 * - Footer section
 */
export const ListView = <TValue,>({ category }: ListViewProps<TValue>) => {
  const items = category.items || [];

  if (!category.renderItem) {
    console.warn(
      `ListView requires renderItem function for category: ${category.id}`,
    );
    return null;
  }

  return (
    <Stack direction="row" spacing={1}>
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {category.renderItem!(item, index)}
        </Box>
      ))}
    </Stack>
  );
};
