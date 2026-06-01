import type { FC } from 'react';
import { resolveStrapiMediaUrl } from 'src/utils/strapi/strapiHelper';
import type { CommonBlockProps, ImageProps } from '../types';
import { RichBlocksVariant } from '../types';

import dynamic from 'next/dynamic';

const Lightbox = dynamic(() =>
  import('src/components/Lightbox/Lightbox').then((mod) => mod.Lightbox),
);

interface ImageBlockProps extends ImageProps, CommonBlockProps {}

export const ImageBlock: FC<ImageBlockProps> = ({ image, variant }) => {
  if (variant !== RichBlocksVariant.BlogArticle) {
    return null;
  }

  const resolvedUrl = resolveStrapiMediaUrl(image?.url);
  if (!resolvedUrl) {
    return null;
  }
  return <Lightbox imageData={{ ...image, url: resolvedUrl }} />;
};
