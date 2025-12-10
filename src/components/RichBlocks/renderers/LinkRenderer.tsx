import { FC } from 'react';
import { ParagraphLink } from '../RichBlocks.style';
import { isExternalUrl } from 'src/utils/urls/isExternalUrl';

interface LinkRendererProps {
  content: {
    url: string;
    children: Array<{ text: string }>;
  };
}

export const LinkRenderer: FC<LinkRendererProps> = ({ content }) => {
  const isExternal = isExternalUrl(content.url);
  const externalProps = isExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  return (
    <ParagraphLink href={content.url} {...externalProps}>
      {content.children[0].text}
    </ParagraphLink>
  );
};
