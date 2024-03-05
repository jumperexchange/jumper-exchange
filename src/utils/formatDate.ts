export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString('en-us', {
    day: 'numeric',
    year: 'numeric',
    month: 'short',
  });
};
