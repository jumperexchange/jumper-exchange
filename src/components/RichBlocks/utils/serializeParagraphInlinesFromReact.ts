import { flatMap } from 'lodash';
import type { ReactNode } from 'react';
import { inlinePartsToPlainString, walkInlines } from './inlineNodeWalker';
import type { InlinePart, PositionedPart } from './inlinePartTypes';

export type {
  InlineTextProps,
  InlinePart,
  PositionedPart,
} from './inlinePartTypes';
export { inlinePartsToPlainString } from './inlineNodeWalker';

/**
 * One concatenated string matching visual order, including link labels (not URLs if label empty).
 */
export function serializeParagraphInlinesFromReact(
  children: Array<ReactNode> | ReadonlyArray<ReactNode>,
): string {
  const list = Array.isArray(children) ? children : [children];
  const parts: InlinePart[] = flatMap(list, (c) => walkInlines(c));
  return inlinePartsToPlainString(parts);
}

/**
 * Same plain string as `serialize` plus `[start, end)` ranges in that string for each part.
 */
export function buildPositionedInlineParts(
  children: Array<ReactNode> | ReadonlyArray<ReactNode>,
): { plain: string; positioned: PositionedPart[] } {
  const list = Array.isArray(children) ? children : [children];
  const parts: InlinePart[] = flatMap(list, (c) => walkInlines(c));
  const positioned: PositionedPart[] = [];
  let o = 0;
  for (const part of parts) {
    const s = o;
    const len = part.kind === 'text' ? part.value.length : part.label.length;
    o += len;
    positioned.push({ start: s, end: o, part });
  }
  return { plain: inlinePartsToPlainString(parts), positioned };
}
