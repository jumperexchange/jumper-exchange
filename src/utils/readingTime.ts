const WORDS_PER_MINUTE = 225;
const DEFAULT_READING_TIME = 'XX'; // Default reading time when words count is zero

export const readingTime = (words?: number) => {
  if (!words) {
    return DEFAULT_READING_TIME;
  }
  const time = Math.ceil(words / WORDS_PER_MINUTE);
  return time;
};
