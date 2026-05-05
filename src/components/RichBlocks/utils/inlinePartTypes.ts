import type { ParagraphProps } from '../types';

export type InlineTextProps = Pick<
  ParagraphProps,
  'bold' | 'italic' | 'underline' | 'strikethrough'
>;

/**
 * A single run of plain text with Strapi-like modifiers, or a link.
 * @see serializeParagraphInlinesFromReact
 */
export type InlinePart =
  | { kind: 'text'; value: string; textProps: InlineTextProps }
  | { kind: 'link'; url: string; label: string };

export type PositionedPart = {
  start: number;
  end: number;
  part: InlinePart;
};
