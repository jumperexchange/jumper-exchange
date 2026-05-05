import { compact, filter, map } from 'lodash';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { LinkRenderer } from './LinkRenderer';
import { renderTextWithOptionalBoldMarkdown } from './textWithOptionalBoldMarkdown';
import type { PositionedPart } from '../utils/inlinePartTypes';
import generateKey from 'src/app/lib/generateKey';

/**
 * Renders a slice [a, b) of the paragraph plain string using positioned inline parts.
 * `a` / `b` are indices into `plain` (untrimmed); caller maps work-space ranges with `lead` offset.
 */
export function renderTableCellFromSegments(
  plain: string,
  positioned: PositionedPart[],
  a: number,
  b: number,
): ReactNode {
  if (a >= b) {
    return null;
  }
  const overlapping = filter(
    positioned,
    ({ start, end }) => end > a && start < b,
  );
  const out = compact(
    map(overlapping, ({ start, end, part }) => {
      const lo = Math.max(a, start);
      const hi = Math.min(b, end);
      if (lo >= hi) {
        return null;
      }
      if (part.kind === 'text') {
        return (
          <Fragment key={generateKey(`c-${lo}-${hi}`)}>
            {renderTextWithOptionalBoldMarkdown(
              plain.slice(lo, hi),
              part.textProps,
            )}
          </Fragment>
        );
      }
      const labelSlice = plain.slice(lo, hi);
      return (
        <LinkRenderer
          key={generateKey(`l-${lo}`)}
          content={{
            url: part.url,
            children: [{ text: labelSlice }],
          }}
        />
      );
    }),
  );
  if (out.length === 0) {
    return plain.slice(a, b) || null;
  }
  if (out.length === 1) {
    return out[0]!;
  }
  return <Fragment>{out}</Fragment>;
}
