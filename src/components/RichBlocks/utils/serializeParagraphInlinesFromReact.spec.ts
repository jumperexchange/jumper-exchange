import { describe, expect, it } from 'vitest';
import { createElement, Fragment, type FC } from 'react';
import {
  buildPositionedInlineParts,
  serializeParagraphInlinesFromReact,
} from './serializeParagraphInlinesFromReact';
import {
  parseMarkdownTable,
  parseMarkdownTableWithRanges,
} from './parseMarkdownTable';

/** @strapi/blocks-react-renderer `Text` passes `{ text, bold?, ... }` on `props`. */
const StrapiText: FC<{
  text: string;
  bold?: boolean;
  italic?: boolean;
}> = () => null;

describe('serializeParagraphInlinesFromReact', () => {
  it('joins only props.text (Strapi text node)', () => {
    const el = createElement(StrapiText, { text: '|x|' });
    expect(serializeParagraphInlinesFromReact([el])).toBe('|x|');
  });

  it('includes link label from default <a> shape', () => {
    const link = createElement(
      'a',
      { href: 'https://li.fi' },
      createElement(StrapiText, { text: 'Li' }),
    );
    const after = createElement(StrapiText, { text: ' | rest' });
    expect(serializeParagraphInlinesFromReact([link, after])).toBe('Li | rest');
  });
});

describe('table detection with mixed inlines + parseMarkdownTable', () => {
  it('parses a GFM table from serialized Strapi-like children', () => {
    const header = createElement(
      Fragment,
      null,
      createElement(StrapiText, { text: '| A | B |\n' }),
      createElement(StrapiText, { text: '| --- | --- |\n' }),
    );
    const row = createElement(StrapiText, { text: '| 1 | 2 |' });
    const plain = serializeParagraphInlinesFromReact([header, row]);
    const parsed = parseMarkdownTable(plain);
    expect(parsed).not.toBeNull();
    expect(parsed!.headers).toEqual(['A', 'B']);
    expect(parsed!.rows).toEqual([['1', '2']]);
  });
});

describe('buildPositionedInlineParts + parseMarkdownTableWithRanges', () => {
  it('aligns positions with plain string', () => {
    const { plain, positioned } = buildPositionedInlineParts([
      createElement(StrapiText, { text: 'ab' }),
      createElement(
        'a',
        { href: 'https://x' },
        createElement(StrapiText, { text: 'cd' }),
      ),
    ]);
    expect(plain).toBe('abcd');
    expect(positioned).toHaveLength(2);
    expect(positioned[0]!.start).toBe(0);
    expect(positioned[0]!.end).toBe(2);
    expect(positioned[1]!.start).toBe(2);
    expect(positioned[1]!.end).toBe(4);
  });

  it('cell ranges in trimmed work string slice the same substrings as splitRow', () => {
    const work = '| A | B |\n| --- | --- |\n| 1 | 2 |';
    const p = parseMarkdownTableWithRanges(work);
    expect(p).not.toBeNull();
    expect(
      work.slice(p!.headerCellRanges[0]!.start, p!.headerCellRanges[0]!.end),
    ).toBe('A');
  });
});
