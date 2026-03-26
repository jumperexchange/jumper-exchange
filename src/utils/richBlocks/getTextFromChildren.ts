import type { BlockChild } from './types';

export function getTextFromChildren(
  children: BlockChild[] | undefined,
): string {
  if (!children?.length) {
    return '';
  }

  return children
    .map((child) => child.text ?? getTextFromChildren(child.children))
    .join('');
}
