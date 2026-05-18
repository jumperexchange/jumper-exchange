import fs from 'node:fs';

/**
 * Deletes the specified directory and all its contents.
 */
export function clearUserDataDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    console.log(`User data directory does not exist: ${dirPath}`);
    return;
  }
  fs.rmSync(dirPath, { force: true, recursive: true });
  console.log(`Deleted user data directory: ${dirPath}`);
}

/**
 * Creates a new user data directory for parallel execution.
 */
export function createNewUserDataDirForParallelExecution(
  dirPath: string,
): void {
  if (fs.existsSync(dirPath)) {
    console.log(`User data directory already exists: ${dirPath}`);
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
  console.log(`Created user data directory: ${dirPath}`);
}

/**
 * Normalizes and sort text obtained from html elements
 * @param {string} text - the text to be normalized
 */
export function normalizeAndSortText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text
    .replace(/\\?"/g, '') // Remove quotes
    .replace(/[\r\n]+/g, ' ') // Normalize newlines
    .replace(/\s*×\s*/g, '|') // Replace × and spaces with a delimiter
    .replace(/\s+/g, ' ') // Collapse extra spaces
    .trim()
    .split('|') // Split by delimiter
    .map((part) => part.trim()) // Clean up each part
    .filter(Boolean) // Remove empty parts
    .sort((a, b) => a.localeCompare(b)) // Sort alphabetically (so order doesn't matter)
    .join(''); // Join back together with no space
}

/**
 * Recursively updates placeholder values in a nested selectors object with provided replacements.
 *
 * This function traverses an object where the values may be strings or nested objects.
 * If a value is a string, it looks for placeholders in the format `{placeholder}` and replaces
 * them with corresponding values from the `replacements` object.
 * If a value is an object, it recursively applies the same logic.
 *
 * @param {Object} selectorsObj - An object containing selectors with optional placeholders.
 *                                The object can be nested.
 * @param {Object} replacements - An object where keys correspond to placeholder names (without curly braces),
 *                                and values are the strings to replace the placeholders with.
 * @returns {Object} A new object with the same structure as `selectorsObj` but with all placeholders replaced.
 */
export function updateSelectorsWithIndex<
  T extends Record<string, any>,
  R extends Record<string, any>,
>(selectorsObj: T, replacements: R): T {
  const updated: Record<string, any> = {};

  for (const [key, value] of Object.entries(selectorsObj)) {
    if (typeof value === 'string') {
      let newValue = value;
      for (const [placeholder, replacement] of Object.entries(replacements)) {
        const pattern = new RegExp(`{${placeholder}}`, 'g');
        newValue = newValue.replace(pattern, String(replacement));
      }
      updated[key] = newValue;
    } else if (typeof value === 'object' && value !== null) {
      updated[key] = updateSelectorsWithIndex(value, replacements);
    } else {
      updated[key] = value;
    }
  }
  return updated as T;
}
