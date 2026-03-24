/**
 * Converts text into a URL-friendly slug by:
 * 1. Converting to lowercase
 * 2. Replacing any non-alphanumeric characters with hyphens
 * 3. Replacing multiple hyphens with a single hyphen
 * Example: "Ethereum Mainnet!" → "ethereum-mainnet"
 */
export const slugify = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
