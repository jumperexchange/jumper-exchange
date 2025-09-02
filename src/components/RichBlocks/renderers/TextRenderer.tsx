import { FC, isValidElement, ReactElement } from 'react';
import { Paragraph } from '../RichBlocks.style';
import newlineToBr from 'src/utils/newlineToBr';
import generateKey from 'src/app/lib/generateKey';
import type { ParagraphProps } from '../types';

interface TextRendererProps extends ParagraphProps {}

export const TextRenderer: FC<TextRendererProps> = ({
  text,
  italic,
  strikethrough,
  underline,
  bold,
}) => {
  const nl2brText: Array<ReactElement | string> = newlineToBr(text);

  return (
    <>
      {nl2brText.map((line, lineIndex) => {
        if (isValidElement(line) && line.type === 'br') {
          return line;
        }

        return (
          <Paragraph
            italic={italic}
            strikethrough={strikethrough}
            underline={underline}
            bold={bold}
            key={generateKey(`paragraph-line-${lineIndex}`)}
          >
            {line}
          </Paragraph>
        );
      })}
    </>
  );
};
