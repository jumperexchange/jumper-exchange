// Not urls/slugify: existing DOM testids and their e2e mirrors rely on this
// exact spaces-only transform.
export const slugifyTestId = (value: string): string =>
  value.toLowerCase().replace(/\s+/g, '-');
