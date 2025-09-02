import { FC } from 'react';
import { LinkRenderer } from './LinkRenderer';
import { HtmlRenderer } from './HtmlRenderer';
import { TextRenderer } from './TextRenderer';
import type { ParagraphProps } from '../types';

interface ParagraphRendererProps {
  element: { props: ParagraphProps };
}

export const ParagraphRenderer: FC<ParagraphRendererProps> = ({ element }) => {
  const { props } = element;

  if (!props.text) return null;

  if (props.content?.type === 'link') {
    return <LinkRenderer content={props.content} />;
  }

  if (props.text.includes('<') && props.text.includes('>')) {
    return <HtmlRenderer {...props} />;
  }

  return <TextRenderer {...props} />;
};
