import type { FC } from 'react';
import { ParagraphLink } from '../RichBlocks.style';
import { isExternalUrl } from 'src/utils/urls/isExternalUrl';

interface LinkRendererProps {
  content: {
    url: string;
    children: Array<{ text: string }>;
  };
}

export const getParagraphLinkProps = (url: string) => ({
  href: url,
  ...(isExternalUrl(url)
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}),
});

export const LinkRenderer: FC<LinkRendererProps> = ({ content }) => {
  return (
    <ParagraphLink {...getParagraphLinkProps(content.url)}>
      {content.children[0].text}
    </ParagraphLink>
  );
};
