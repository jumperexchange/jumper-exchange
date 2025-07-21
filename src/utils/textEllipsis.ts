/**
 * Returns a style object for single-line ellipsis.
 */
export const singleLineEllipsis = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/**
 * Returns a style object for multi-line ellipsis.
 * @param maxHeight The maximum height in px (number, e.g. 60)
 * @param lines The number of lines to clamp
 */
export const multilineEllipsis = (maxHeight: number, lines: number) => {
  return {
    maxHeight: `${maxHeight}px`,
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
};
