/**
 * Returns a style object for single-line or multi-line ellipsis.
 * @param lines The number of lines to clamp
 * @param maxHeight The maximum height in px (number, e.g. 60)
 */

export const getTextEllipsisStyles = (lines: number, maxHeight?: number) => {
  if (lines === 1) {
    return {
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };
  }

  return {
    maxHeight: `${maxHeight}px`,
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
};
