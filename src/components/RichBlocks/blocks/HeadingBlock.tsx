import { FC } from 'react';
import generateKey from 'src/app/lib/generateKey';
import { CommonBlockProps, HeadingProps } from '../types';
import { Heading } from '../RichBlocks.style';

interface HeadingBlockProps extends HeadingProps, CommonBlockProps {}

const isValidHeadingLevel = (level: number): level is 1 | 2 | 3 | 4 | 5 | 6 => {
  return level >= 1 && level <= 6;
};

export const HeadingBlock: FC<HeadingBlockProps> = ({
  children,
  level,
  sx,
}) => {
  if (!children) {
    return null;
  }

  const validLevel = isValidHeadingLevel(level) ? level : 1;

  return (
    <Heading
      level={level}
      variant={`h${validLevel}`}
      sx={sx}
      key={generateKey('heading')}
    >
      {children}
    </Heading>
  );
};
