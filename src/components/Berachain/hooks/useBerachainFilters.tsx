import { sepolia } from 'viem/chains';

function useBerachainFilters() {
  const filters = [];

  filters.push({
    id: 'category',
    value: 'boyco',
  });

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    filters.push({
      id: 'chain_id',
      value: sepolia.id,
      condition: 'NOT',
    });
  }

  return {
    page_size: 500,
    filters,
  };
}

export default useBerachainFilters;
