export const normalizeZero = (value: string) => {
  if (value === '') {
    return '0';
  }
  if (value.length > 1 && value.startsWith('0') && value[1] !== '.') {
    return value.replace(/^0+/, '') || '0';
  }
  return value;
};
