import type { FC } from 'react';
import generateKey from 'src/app/lib/generateKey';
import type { CommonBlockProps, HeadingProps } from '../types';
import { Heading } from '../RichBlocks.style';
import { isValidHeadingLevel } from '@/utils/richBlocks/isValidHeadingLevel';

interface HeadingBlockProps extends HeadingProps, CommonBlockProps {
  id?: string;
}

export const HeadingBlock: FC<HeadingBlockProps> = ({
  children,
  level,
  id,
  sx,
}) => {
  if (!children) {
    return null;
  }

  const validLevel = isValidHeadingLevel(level) ? level : 1;

  return (
    <Heading
      id={id}
      level={level}
      variant={`h${validLevel}`}
      sx={sx}
      key={generateKey('heading')}
    >
      {children}
    </Heading>
  );
};
