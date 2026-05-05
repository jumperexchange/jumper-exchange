import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { TextRenderer } from './TextRenderer';
import { HtmlRenderer } from './HtmlRenderer';
import type { InlineTextProps } from '../utils/inlinePartTypes';
import generateKey from 'src/app/lib/generateKey';

const BOLD_MD = /\*\*([^*]+)\*\*/g;

/**
 * Renders a text slice with `**...**` split into bold runs (pasted markdown in a cell).
 * Strapi `bold: true` is applied via `textProps` on the outer TextRenderer when no `**` is used.
 */
export function renderTextWithOptionalBoldMarkdown(
  text: string,
  textProps: InlineTextProps = {},
): ReactNode {
  if (!text) {
    return null;
  }
  if (text.includes('<') && text.includes('>')) {
    return (
      <HtmlRenderer
        text={text}
        bold={textProps.bold}
        italic={textProps.italic}
        underline={textProps.underline}
        strikethrough={textProps.strikethrough}
      />
    );
  }
  if (!text.includes('**')) {
    return <TextRenderer {...textProps} text={text} />;
  }
  const parts: ReactNode[] = [];
  let last = 0;
  BOLD_MD.lastIndex = 0;
  let m: RegExpExecArray | null;
  let k = 0;

  while ((m = BOLD_MD.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(
        <TextRenderer
          key={generateKey(`b-${k++}`)}
          {...textProps}
          text={text.slice(last, m.index)}
        />,
      );
    }
    parts.push(
      <TextRenderer
        key={generateKey(`B-${k++}`)}
        {...textProps}
        text={m[1] ?? ''}
        bold
      />,
    );
    last = m.index + m[0]!.length;
  }
  if (last < text.length) {
    parts.push(
      <TextRenderer
        key={generateKey(`b-${k++}`)}
        {...textProps}
        text={text.slice(last)}
      />,
    );
  }
  if (parts.length === 0) {
    return <TextRenderer {...textProps} text={text} />;
  }
  return <Fragment>{parts}</Fragment>;
}
