export function removeFormattingTags(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}
