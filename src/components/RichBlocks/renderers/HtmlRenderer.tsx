import { FC } from 'react';
import parse from 'html-react-parser';
import { Paragraph } from '../RichBlocks.style';
import type { ParagraphProps } from '../types';

interface HtmlRendererProps extends ParagraphProps {}

export const HtmlRenderer: FC<HtmlRendererProps> = ({
  text,
  italic,
  strikethrough,
  underline,
  bold,
}) => (
  <Paragraph
    italic={italic}
    strikethrough={strikethrough}
    underline={underline}
    bold={bold}
    as="div"
  >
    {parse(text)}
  </Paragraph>
);
