export const getVisiblePages = (
  currentPage: number,
  totalPages: number,
  maxVisible: number,
): number[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const median = Math.floor(maxVisible / 2);
  let startPage: number;

  if (currentPage <= median) {
    startPage = 0;
  } else if (currentPage >= totalPages - median - 1) {
    startPage = totalPages - maxVisible;
  } else {
    startPage = currentPage - median;
  }

  return Array.from({ length: maxVisible }, (_, i) => startPage + i);
};
