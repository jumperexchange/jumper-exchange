import { FC, PropsWithChildren } from 'react';
import { CommonBlockProps, QuoteProps } from '../types';
import generateKey from 'src/app/lib/generateKey';
import { Paragraph, ParagraphBlockContainer } from '../RichBlocks.style';

interface QuoteBlockProps extends PropsWithChildren, CommonBlockProps {}

export const QuoteBlock: FC<QuoteBlockProps> = ({ children, sx }) => {
  if (!Array.isArray(children)) {
    return null;
  }
  const quoteChildren = children as Array<{ props: QuoteProps }>;

  return quoteChildren.map((el) => (
    <ParagraphBlockContainer sx={sx} key={generateKey('quote')}>
      <Paragraph as="q" quote>
        {el.props.text}
      </Paragraph>
    </ParagraphBlockContainer>
  ));
};
