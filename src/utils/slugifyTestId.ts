// Deliberately not urls/slugify: testids must keep matching the ids already
// rendered on develop (spaces-only transform), and e2e selectors mirror it.
export const slugifyTestId = (value: string): string =>
  value.toLowerCase().replace(/\s+/g, '-');
