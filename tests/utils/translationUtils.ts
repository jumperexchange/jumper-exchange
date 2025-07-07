/**
 * Removes formatting tags from translation text for testing purposes
 * @param text The translation text that may contain formatting tags
 * @returns The text with all formatting tags removed
 */
export function removeFormattingTags(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}
