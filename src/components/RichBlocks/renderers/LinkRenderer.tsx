import { FC } from 'react';
import { ParagraphLink } from '../RichBlocks.style';

interface LinkRendererProps {
  content: {
    url: string;
    children: Array<{ text: string }>;
  };
}

export const LinkRenderer: FC<LinkRendererProps> = ({ content }) => (
  <ParagraphLink href={content.url}>{content.children[0].text}</ParagraphLink>
);
