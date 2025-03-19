export function sanitizeAddress(address: string): string {
  // Remove any non-hexadecimal characters and ensure 0x prefix
  return '0x' + address.replace(/[^a-fA-F0-9]/g, '').slice(0, 40);
}

export function sanitizeNumeric(value: string): string {
  // Remove any non-numeric characters except decimal point
  return value.replace(/[^\d.]/g, '');
}

export function sanitizeTheme(theme: string): 'light' | 'dark' {
  return theme === 'dark' ? 'dark' : 'light';
}

export function sanitizeHighlighted(value: string): string {
  // Only allow valid highlighted values
  const validValues = ['from', 'to', 'amount', '0', '1', '2'];
  return validValues.includes(value) ? value : '0';
}
