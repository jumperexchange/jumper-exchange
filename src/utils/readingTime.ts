/* Props: https://dev.to/michaelburrows/calculate-the-estimated-reading-time-of-an-article-using-javascript-2k9l */
export const readingTime = (text: string) => {
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
};
